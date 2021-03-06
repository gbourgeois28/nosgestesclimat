import { splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { partition } from 'ramda'
import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	correctValue,
	extractCategoriesNamespaces,
} from '../../components/publicodesUtils'
import { actionImg } from '../../components/SessionBar'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { sortBy, useQuery } from '../../utils'
import ActionStack from './ActionStack'
import ActionTutorial from './ActionTutorial'
import { disabledAction, supersededAction } from './ActionVignette'
import AllActions from './AllActions'
import CategoryFilters from './CategoryFilters'
import { humanWeight } from './HumanWeight'
import SimulationMissing from './SimulationMissing'

const { encodeRuleName, decodeRuleName } = utils

export default ({ display }) => {
	let category = useQuery().get('catégorie')

	const rules = useSelector((state) => state.rules)
	const situation = useSelector(situationSelector),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const flatActions = rules['actions']

	const [radical, setRadical] = useState(true)

	const simulation = useSelector((state) => state.simulation)
	const tutorials = useSelector((state) => state.tutorials)

	const objectifs = ['bilan', ...flatActions.formule.somme]

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const actionChoices = useSelector((state) => state.actionChoices)
	const [focusedAction, focusAction] = useState(null)

	const sortedActionsByImpact = sortBy(
			(a) => (radical ? 1 : -1) * correctValue(a)
		)(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			const superseded = supersededAction(
				action.dottedName,
				rules,
				actionChoices
			)
			const disabled = disabledAction(flatRule, action.nodeValue)
			return !superseded && (action.dottedName === focusedAction || !disabled)
		})

	const finalActions = filterByCategory(interestingActions)

	const categories = extractCategoriesNamespaces(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	//TODO this is quite a bad design
	// we're better check if the test is finished
	// but is it too restrictive ?
	const simulationWellStarted = answeredQuestions.length > 50

	if (!simulationWellStarted) {
		return <SimulationMissing />
	}

	if (tutorials.actions !== 'skip') {
		const [value, unit] = humanWeight(bilans[0].nodeValue)
		return <ActionTutorial {...{ value, unit }} />
	}

	return (
		<div
			css={`
				padding: 0 0 1rem;
				${display !== 'list' && `max-width: 600px;`}
				margin: 1rem auto;
			`}
		>
			<CategoryFilters
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>

			<div
				css={`
					display: block;
					text-align: center;
				`}
			>
				<small>{actions.length} actions disponibles.</small>{' '}
				<small>Triées par :</small>{' '}
				<button
					onClick={() => setRadical(!radical)}
					className="ui__ dashed-button"
					css="color: var(--lighterTextColor); font-size: 85% !important"
				>
					{radical ? (
						<span>le plus d'impact </span>
					) : (
						<span>le moins d'impact</span>
					)}
					.
				</button>
			</div>
			{display === 'list' ? (
				<AllActions
					{...{
						actions: finalActions.reverse(),
						bilans,
						rules,
						focusedAction,
						focusAction,
					}}
				/>
			) : finalActions.length ? (
				<ActionStack
					key={category}
					actions={finalActions}
					onVote={(item, vote) => console.log(item.props, vote)}
					total={bilans.length ? bilans[0].nodeValue : null}
				></ActionStack>
			) : (
				<p>{emoji('🤷')} Plus d'actions dans cette catégorie</p>
			)}
			{false /* Désactivation de cette fonctionnalité pas terminée */ && (
				<Link
					to={display === 'list' ? '/actions' : '/actions/liste'}
					css=" text-align: center; display: block; margin: 1rem"
				>
					<button className="ui__ button">
						{display === 'list' ? 'Vue jeu de cartes (en dev)' : 'Vue liste'}
					</button>
				</Link>
			)}
		</div>
	)
}
