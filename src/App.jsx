import { useEffect, useState } from 'react'
import './App.css'

const BASE = import.meta.env.BASE_URL

function Nav() {
  return (
    <header className="nav">
      <a className="nav-brand" href="#top">
        <span className="nav-dot p0" />
        <span className="nav-dot p1" />
        The Mixed Game
      </a>
      <nav className="nav-links">
        <a href="#switch">The switch</a>
        <a href="#seeing">Four cases</a>
        <a href="#tournament">Tournament</a>
        <a
          className="nav-cta"
          href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash"
        >
          Research repo
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <p className="eyebrow">Multi-agent reinforcement learning &middot; game theory</p>
        <h1 className="hero-title">
          Two players, one ball, and sometimes <em>no safe move</em>.
        </h1>
        <p className="hero-lede">
          A discrete soccer Markov game, solved exactly &mdash; no training run,
          no approximation. Most of the time the best move is obvious. This
          site is a map of the exact moments it stops being obvious, and why.
        </p>
        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/report.pdf"
          >
            Read the full report
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash"
          >
            View the source
          </a>
        </div>
      </div>
      <figure className="hero-figure">
        <img src={`${BASE}figures/kickoff.png`} alt="Kickoff position: player 0 (blue) carries the ball toward the right goal, player 1 (green) defends the left." />
        <figcaption>kickoff &mdash; state (0, 1, 6, 3, 0)</figcaption>
      </figure>
    </section>
  )
}

function Eyebrow({ n, children }) {
  return (
    <p className="eyebrow section-eyebrow">
      <span className="eyebrow-n">{n}</span>
      {children}
    </p>
  )
}

function StatTile({ k, value, unit, children }) {
  return (
    <div className="stat-tile">
      <p className="stat-k">{k}</p>
      <p className="stat-v">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>
      <p className="stat-note">{children}</p>
    </div>
  )
}

function TheGame() {
  return (
    <section className="section" id="game">
      <div className="section-inner">
        <Eyebrow n="01">The setup</Eyebrow>
        <h2>Two players, one ball, a grid.</h2>
        <p>
          One player carries the ball toward the opponent&apos;s goal; the
          other tries to stop them. Every turn both players choose a move at
          the same instant &mdash; up, down, left, or right, one cell &mdash; with
          neither seeing the other&apos;s choice first. It is zero-sum: every
          unit of advantage one player gains is exactly what the other loses.
        </p>
        <p>
          That single rule &mdash; simultaneous, opposed choice &mdash; is the
          entire mechanism behind everything on this page. It is also exactly
          the mechanism behind poker, pricing wars, and any two systems
          competing inside the same environment.
        </p>
      </div>
    </section>
  )
}

function TheSwitch() {
  return (
    <section className="section band" id="switch">
      <div className="section-inner">
        <Eyebrow n="02">The finding</Eyebrow>
        <h2>Widen the goal by one cell, and the game stops being predictable.</h2>
        <p>
          Hold everything else fixed and change one number: how many cells
          wide the goal is. With a single defendable cell, a defender can
          always plant itself in the one spot that matters &mdash; there is
          nothing to guess, anywhere on the board. The instant the goal is
          wide enough that one defender cannot cover every scoring cell at
          once, certain situations flip completely: the only rational play
          becomes to genuinely randomize.
        </p>
        <div className="stat-grid">
          <StatTile k="single-cell goal" value="0" unit="/ 2,380">
            situations need anything but a fixed, deterministic move &mdash;
            verified by machine, not assumed.
          </StatTile>
          <StatTile k="goal &ge; 2 cells" value="94" unit="situations">
            provably require a mixed strategy; 68 of them reduce to the same
            simple shape &mdash; the carrier picking a lane, the defender
            guessing it.
          </StatTile>
        </div>
        <p>
          The switch survives board size, board shape, and where exactly the
          goal sits. It does <em>not</em> survive a different source of
          randomness: give every player a small chance of slipping to a
          random move, and the same forced-mixing behaviour reappears even on
          a single-cell goal. The mechanism is specific &mdash; a coin neither
          player controls, sitting exactly where the carrier has two lanes
          and the defender can only cover one.
        </p>
      </div>
    </section>
  )
}

function CaseCard({ tag, state, title, children }) {
  return (
    <div className="case-card">
      <span className="case-tag">{tag}</span>
      <h3>{title}</h3>
      <p className="case-state">state = {state}</p>
      <p>{children}</p>
    </div>
  )
}

function Positions() {
  return (
    <section className="section" id="seeing">
      <div className="section-inner">
        <Eyebrow n="03">Player positions</Eyebrow>
        <h2>What the players are actually doing, not just where mixing occurs.</h2>
        <p>
          A heatmap of &ldquo;here be mixed strategies&rdquo; answers the
          wrong question. What matters is the actual configuration: where the
          two players are, which moves are genuinely live, and why the
          payoffs leave a player with no honest reason to prefer one action
          over another &mdash; the matrix itself, not a summary statistic like
          entropy. Reading each card below: the board position (blue = player
          0, green = player 1, the orange dot is the ball, arrow thickness =
          move probability), and the stage game as a node-and-arrow graph
          &mdash; a lit node is a stable outcome, a closed loop of arrows means
          no cell is safe. Four representative cases, read directly off the
          exact solver:
        </p>

        <div className="case-grid">
          <CaseCard tag="Two-action mix" state="(0, 1, 1, 1, 0)" title="The typical shape: which lane to take">
            The carrier mixes <span className="mono">U 63.5% / D 36.5%</span>;
            the defender answers <span className="mono">U 36.5% / R 63.5%</span>.
            Physically: the carrier is deciding which goal row to attack, and
            the defender is guessing which one. Mathematically, both actions
            give the carrier the exact same expected continuation value against
            the defender&apos;s own mix &mdash; that equality <em>is</em> the
            equilibrium condition. 90 of the 94 mixed states on this board
            share this exact shape, a vertical lane choice.
          </CaseCard>
          <CaseCard tag="Three-action mix" state="(0, 0, 2, 0, 0)" title="Not a two-way guess at all">
            Support <span className="mono">U 43.3% / L 54.7% / R 1.9%</span>{' '}
            for the carrier, six cells from goal &mdash; as far as this board
            allows. Entropy (1.11 bits) is the richest on this page, but the
            real content is the matrix: three rows are simultaneously
            undominated because the defender is close enough to threaten all
            three, so no single row is safely better than the others.
          </CaseCard>
          <CaseCard tag="L/R indifference" state="(1, 1, 1, 0, 1)" title="&ldquo;An equal chance of winning either way&rdquo;">
            The carrier&apos;s entire live option set is{' '}
            <span className="mono">L</span> and <span className="mono">R</span>{' '}
            &mdash; no vertical move survives at all. Both give the same
            expected outcome against the defender&apos;s own mix, so there is
            no honest reason to prefer one. This is the rarer shape: only 4 of
            94 mixed states cross a purely horizontal pair instead of a
            vertical one.
          </CaseCard>
          <CaseCard tag="The surprising case" state="(4, 4, 5, 4, 0), deterministic" title="Zero transition randomness &mdash; still forced to mix">
            Every other case here owes its mix to the coin flip in who wins a
            contested cell. Turn that off entirely (fully deterministic
            movement) and add a reward that pays for field position
            (<span className="mono">scoring=&quot;territory&quot;</span>) instead
            of goals alone: the carrier still mixes{' '}
            <span className="mono">D 53.8% / R 46.2%</span>, near a fair coin
            (entropy 0.996 bits). The forced guess doesn&apos;t need a
            stochastic transition at all &mdash; coupling the reward to both
            players&apos; actions is enough on its own.
          </CaseCard>
        </div>

        <figure className="figure-frame wide">
          <img src={`${BASE}figures/positions_web.png`} alt="Four boards, one per case above: blue and green discs are the two players, the orange dot is the ball, and arrows show each player's move probabilities." />
          <figcaption>
            the four cases above, drawn: blue = player 0, green = player 1,
            the orange dot is the ball, arrow thickness = probability of that
            move.
          </figcaption>
        </figure>

        <div className="callout">
          <p className="callout-quote">
            &ldquo;When we move right and when we move left, there&apos;s an
            equal chance of me winning. That&apos;s why I am indifferent
            between the two.&rdquo;
          </p>
          <p className="callout-body">
            A best-reply cycle and mutual indifference are the same fact seen
            from two sides, not two different stories: a mixed equilibrium is
            exactly the strategy pair where every action in the support earns
            the same expected payoff against the opponent&apos;s mix. That
            equality is why the graphs above cycle with no resting point.
          </p>
        </div>

        <p>
          Three more cases live in the full write-up: the exact <em>mirror</em>{' '}
          of the two-action case (value negated to 17 decimal places), a hedge
          so shallow (97.5% / 2.5%) that rounding it to &ldquo;pure&rdquo;
          would misread the game, and this project&apos;s own tackle rule
          producing the same duel by a completely different mechanism &mdash;
          each with its board, its node-and-arrow graph, and its exact
          4&times;4 matrix.{' '}
          <a href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/positions.pdf">
            All seven cases, as a PDF &rarr;
          </a>
        </p>

        <figure className="figure-frame wide">
          <img src={`${BASE}figures/showcase.png`} alt="Six mixed states drawn as boards with weighted arrows for each player's move probabilities, from a near-even split to a mirror-image symmetry check to the project's own tackle rule." />
        </figure>
      </div>
    </section>
  )
}

function Mechanism() {
  return (
    <section className="section band" id="mechanism">
      <div className="section-inner">
        <Eyebrow n="04">Why it happens</Eyebrow>
        <h2>No cell is a stable outcome &mdash; the check needs no solver at all.</h2>
        <p>
          Look at one matchup at a time. Does either player have a single
          move that is at least as good as anything else, no matter what the
          other does? If yes, that move is the obvious answer. If{' '}
          <em>every</em> move can be beaten by some response, the best replies
          chase each other in a loop &mdash; the exact shape of
          rock&ndash;paper&ndash;scissors &mdash; and the only sane move inside a loop
          is to randomize.
        </p>
        <figure className="figure-frame">
          <img src={`${BASE}figures/rps_vs_soccer.png`} alt="Rock-paper-scissors next to a real soccer stage game, both showing best replies that cycle with no stable cell." />
          <figcaption>the same cycle, twice &mdash; no learning required to see it, just checking every cell once</figcaption>
        </figure>
        <figure className="figure-frame">
          <img src={`${BASE}figures/rule_fingerprints.png`} alt="Six small boards, one per collision rule, showing where mixed strategies are required." />
          <figcaption>
            six different rules for who wins a contested ball, six different
            fingerprints of where the forced coin flip lands
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Tournament() {
  const [rows, setRows] = useState(null)
  useEffect(() => {
    fetch(`${BASE}data/tournament4.json`)
      .then((res) => res.json())
      .then(setRows)
      .catch(() => setRows([]))
  }, [])

  const cols = [
    ['always-left', 'vs. always-left'],
    ['random', 'vs. random'],
    ['hand-built', 'vs. hand-built'],
    ['challenger', "vs. its own challenger"],
  ]

  return (
    <section className="section" id="tournament">
      <div className="section-inner">
        <Eyebrow n="05">Put to the test</Eyebrow>
        <h2>Knowing when to bluff is the difference between winning and losing.</h2>
        <p>
          Four policies, each played against an opponent built specifically
          to find and punish its weakness. <strong>Minimax</strong> is the
          policy this project solves for &mdash; it mixes exactly where the
          theory says it must, and stays pure everywhere else. The rest never
          mix at all.
        </p>
        <div className="table-frame">
          <table>
            <thead>
              <tr>
                <th>policy</th>
                {cols.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((row) => (
                <tr key={row.policy}>
                  <td className="policy-name">{row.policy}</td>
                  {cols.map(([key]) => {
                    const v = parseFloat(row[key])
                    const cls = key === 'challenger' ? (v >= 0 ? 'hi' : 'lo') : ''
                    return (
                      <td key={key} className={cls}>
                        {v >= 0 ? '+' : ''}
                        {v.toFixed(2)}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {rows === null && (
                <tr>
                  <td colSpan={5} className="loading">loading experiments/tournament4.csv&hellip;</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="table-caption">expected goal difference, exact solve &mdash; read live from this project&apos;s own experiment data</p>
        <p>
          Every deterministic policy looks strong against a weak opponent and
          collapses the moment a challenger is built to exploit it. Only the
          policy that knows how much to randomize survives being specifically
          hunted &mdash; the practical payoff of doing the harder math on the
          small slice of situations that actually need it.
        </p>
        <figure className="figure-frame wide">
          <img src={`${BASE}figures/tournament4.png`} alt="Bar chart of the tournament: minimax exploits weak opponents and survives its challenger, greedy and hand-built policies collapse against a tailored challenger." />
        </figure>
      </div>
    </section>
  )
}

function WhyItMatters() {
  return (
    <section className="section closing" id="why">
      <div className="section-inner">
        <Eyebrow n="06">Why it matters</Eyebrow>
        <h2>A small game, a question that shows up anywhere agents share a world.</h2>
        <p className="lede-lg">
          Strip away the ball and the grid, and this is the question
          underneath every setting where two or more decision-makers with
          opposing goals act in the same environment: poker agents,
          adversarial robustness, pricing bots, multi-robot coordination.
          Being predictable is a liability the moment someone is watching
          closely enough to exploit it &mdash; but paying the cost of
          &ldquo;always consider randomizing&rdquo; everywhere is wasteful,
          because most situations really do have a clean, obvious answer.
        </p>
        <p>
          This project&apos;s contribution is a cheap, exact way to tell which
          regime a given situation is in &mdash; instead of an expensive
          general solver everywhere, or a policy that is confidently
          deterministic in exactly the spots where that confidence loses.
        </p>
        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/report.pdf"
          >
            Read the full report
          </a>
          <a
            className="btn btn-ghost"
            href="https://charith-reddy-pareddy.github.io/soccer-markov-nash/"
          >
            The technical documentation site
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="mono footer-line">
          Charith Reddy Pareddy &middot; the-mixed-game &middot; figures and
          data generated by{' '}
          <a href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash">
            soccer-markov-nash
          </a>
        </p>
        <p className="mono footer-line footer-faint">
          solved exactly &mdash; nothing on this page was learned by a neural network
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <TheGame />
      <TheSwitch />
      <Positions />
      <Mechanism />
      <Tournament />
      <WhyItMatters />
      <Footer />
    </>
  )
}
