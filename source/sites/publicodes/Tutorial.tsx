import AbacusFrance from 'Images/abacus-france.svg'
import CO2e from 'Images/co2e.svg'
import ObjectifClimat from 'Images/objectif-climat.svg'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { skipTutorial } from '../../actions/actions'
import emoji from '../../components/emoji'
import CarbonImpact from './CarbonImpact'
import Chart from './chart/index.js'
import HorizontalSwipe from './HorizontalSwipe'
import Slide from './TutorialSlide'
import GreenhouseEffect from 'Images/greenhouse-effect.svg'

export default ({}) => {
	const tutorials = useSelector((state) => state.tutorials)

	if (tutorials['testIntro']) return null
	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const index = tutos.length

	const Component = slides[index]

	const dispatch = useDispatch()

	const skip = (name, unskip) => dispatch(skipTutorial(name, unskip)),
		last = index === slides.length - 1,
		next = () => skip(last ? 'testIntro' : 'testIntro' + index),
		previous = () => dispatch(skipTutorial('testIntro' + (index - 1), true))

	return (
		<div
			css={`
				height: 70vh;
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
			`}
		>
			<HorizontalSwipe {...{ next, previous }}>
				<Slide
					{...{
						last,
						skip,
					}}
				>
					<Component />
				</Slide>
			</HorizontalSwipe>
		</div>
	)
}

const slides = [
	() => (
		<>
			<h1>Mon empreinte climat {emoji('😶‍🌫️')} ?</h1>
			<p>Pas de panique, on vous explique ce que c'est.</p>
			<p>
				Le climat de notre planète </strong> se réchauffe dangereusement </strong> ! C'est ce
			  qu'on appelle le réchauffement climatique. Et il se réchauffe vite du fait des
			  très nombreuses émissions de gaz à effet de serre émit par les activités humaines
			  (industries, déplacements, élevages, etc.).
			</p>
			<GreenhouseEffect css="width: 14rem" />
			<p>
				Ce test vous donne en moins de {emoji('⏱️')} 10 minutes {' '}
				<strong> votre contribution </strong> au réchauffement climatique. Et oui on contribue tous un peu...
			</p>
		</>
	),
	() => (
		<>
			<h1> Et vous mesurez ça comment ?</h1>
			<p>
				En répondant à des questions sur vos habitudes quotidiennes on estime votre empreinte carbone 
				exprimée en équivalent CO₂. C’est un peu barbare comme unité mais en réalité c’est facile à comprendre.
			<p>
				Le dioxyde de carbone (CO₂{' '}
				<img
					src="/images/co2.svg"
					css={`
						object-fit: cover;
						vertical-align: middle;
						width: 3.5rem;
						height: 1.7rem;
					`}
				/>
				), vous connaissez forcément : c’est le gaz que l’on rejette à chaque expiration. alors non, la respiration 
				des êtres humains ne participe pas au changement climatique. Ce qui y participe, c’est le CO₂ 
				(et les autres gaz à effet de serre) émis en quantités massives par les machines qui nous transportent, nous fournissent de 
				l’électricité, font notre confort mais aussi ce que nous achetons et mangeons.
				Bref tout ce qui fait notre vie moderne !
			</p>
			<div
				css={`
					svg {
						height: 7rem;
						margin: 0.6rem auto;
						display: block;
						animation: fall 0.5s ease-in;
					}

					@keyframes fall {
						from {
							transform: translateY(-100%);
							opacity: 0;
						}
						80% {
							transform: translateY(10%);
							opacity: 1;
						}
						100% {
							transform: translateY(0%);
							opacity: 1;
						}
					}

					svg text {
						mask-size: 200%;

						mask-image: linear-gradient(
							-75deg,
							rgba(0, 0, 0, 0.6) 30%,
							#000 50%,
							rgba(0, 0, 0, 0.6) 70%
						);
						mask-size: 200%;
						animation: shine 2s linear infinite;

						@keyframes shine {
							from {
								-webkit-mask-position: 150%;
							}
							to {
								-webkit-mask-position: -50%;
							}
						}
					}
				`}
			>
				<CO2e />
			</div>
			<p>
				À tel point qu'on le compte en milliers de kilos par an et par personne,
				donc en <strong>tonnes</strong> de CO₂e !
				Revenons au CO2 équivalent. Que signifie ce terme équivalent (<em>e</em>). Il faut savoir 
				qu’il n’existe pas que le CO2 comme gaz à effet de serre
			</p>
			<blockquote>
				<p>
					{emoji('💡')}&nbsp; Vous avez d’ailleurs peut-être déjà entendu parler 
					du méthane (dans le cadre des élevages)&nbsp;
					<img
						src="/images/methane.svg"
						css="width: 1.8rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
					/>{' '}
					ou du protoxyde d’azote (dans le cadre de l’agriculture).{' '}
					<img
						src="/images/n2o.svg"
						css="width: 3rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
					/>
					Tous les gaz à effets de serre ne participent pas de la même manière au réchauffement. Le méthane par exemple 
					a un pouvoir réchauffant 25 fois plus fort que le CO2. C’est pourquoi tous les gaz à effet de serre 
					sont convertis en C02 afin de simplifier la mesure.{' '}
				</p>
			</blockquote>
		</>
	),
	() => (
		<>
			<h1>Et concrètement ?</h1>
			<p>
				Pour faire simple, chaque année, un français émet en moyenne <strong> 10 tonnes de CO₂e<strong>. 
				Le but de Nos Gestes Climat c’est de personnaliser ce résultat en fonction des réponses que vous apportez.
			</p>
			<AbacusFrance css="width:10rem; height: 100%" />
			<p>
				10 tonnes, c’est bien ou c’est mal ?
				On ne va pas se mentir, 10 tonnes c’est beaucoup et c’est même trop ! Si l’on veut respecter l’Accord de Paris
				(qui est de limiter le réchauffement à 2°) il faut viser une empreinte de 2 tonnes {emoji('😵')}
				et vous allez voir c’est pas facile{' '}
				<span css="@media(min-width: 800px){display: none}">
					ci-dessous {emoji('⤵️')}{' '}
				</span>
				<span css="@media(max-width: 800px){display: none}">
					ci-dessus {emoji('⤴️')}{' '}
				</span>
				.
			</p>
			<div css="margin: 1rem 0">
				<CarbonImpact demoMode />
			</div>
		</>
	),
	() => (
		<>
			<h1>2 tonnes ! Mais c’est impossible !</h1>
			<p> 
				C’est en effet extrêmement difficile, c’est certain ! C’est d’autant plus difficile si l’on essaie
				d’attendre 2 tonnes « seul ». Atteindre cet objectif passera bien évidemment par des changements individuels 
				mais surtout par des transformations collectives qui rendront plus facile l’objectif <strong>2 tonnes<strong>. 
				On peut penser à des produits/services peu émetteurs et réparables, au développement d’alternative efficace
				au tout voiture et à tant d’autres choses encore !
			</p>

			<ObjectifClimat
				css={`
					width: 16rem;
					g path:first-child {
						stroke-dasharray: 1000;
						stroke-dashoffset: 1000;
						animation: dash 5s ease-in forwards;
						animation-delay: 1s;
					}

					@keyframes dash {
						to {
							stroke-dashoffset: 0;
						}
					}
					g path:nth-child(2) {
						animation: appear 2s ease-in;
					}
					@keyframes appear {
						from {
							opacity: 0;
						}
						30% {
							opacity: 0;
						}
						100% {
							opacity: 1;
						}
					}
					path[fill='#532fc5'] {
						fill: var(--color);
					}
				`}
			/>
			<p css="text-align: center; line-height: 1.2rem">
				<em>
					Pour en savoir plus, tout est expliqué <br />
					dans{' '}
					<a href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/">
						cet article
					</a>{' '}
					(15 min de lecture)
				</em>
				.
			</p>
		</>
	),
	() => (
	),
	() => (
		<>
			<h1>Alors, c'est parti ?</h1>
			<p>Quelques astuces pour vous aider à compléter le test.</p>
			<blockquote>
				{emoji('👤')}&nbsp; Répondez autant que possible aux questions en votre nom. Même si nos habitudes quotidiennes
				sont souvent influencés par les autres, ceci est un test individuel
			</blockquote>
			<blockquote>
				{emoji('💼')}&nbsp; Répondez pour votre vie perso, pas pour votre boulot
				(ou vos études). <em>Une seule exception </em>: votre trajet
				domicile-travail doit être inclus dans les km parcourus.
			</blockquote>
			<blockquote>
				{emoji('❓️')}&nbsp; D'autres questions ? Consultez notre{' '}
				<Link to="/contribuer">FAQ</Link> à tout moment.
			</blockquote>
		</>
	),
]
