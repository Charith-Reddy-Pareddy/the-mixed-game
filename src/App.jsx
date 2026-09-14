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
        <a href="#seeing">Cases</a>
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
        <p className="meta-line">
          Research project &middot; Fall 2026 &middot; Multi-Agent Reinforcement
          Learning &middot; Last updated September 2026
        </p>
        <p className="hero-lede">
          A discrete soccer Markov game. The core game is solved exactly,
          giving us ground truth for every later approximation experiment.
          Most of the time the best move is obvious. This site is a map of
          the exact moments it stops being obvious, and why.
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
          Simultaneous choice creates the strategic setting, but it is not
          enough on its own &mdash; the deterministic version of this same game
          is simultaneous too, and it is pure everywhere. Mixing only becomes
          necessary when the transition or the reward <em>couples</em> the
          players&apos; actions, so that each player&apos;s best move depends on
          the other&apos;s. That coupling is also exactly what shows up in
          poker, pricing wars, and any two systems competing inside the same
          environment.
        </p>
      </div>
    </section>
  )
}

function MainFinding() {
  return (
    <section className="section band" id="switch">
      <div className="section-inner">
        <Eyebrow n="02">The finding</Eyebrow>
        <h2>
          Under Littman&apos;s random move order, widening the goal creates
          states where no pure move is safe.
        </h2>
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
          <StatTile k="7&times;5 board, 3-cell goal" value="94" unit="no-pure-saddle states">
            have no pure saddle on this board &mdash; no deterministic move is
            safe. Of those, 64 have a uniquely forced mix; the rest are
            degenerate LP outputs (below).
          </StatTile>
        </div>
        <p>
          Across the tested Littman-family boards, every one-cell goal
          produced zero such states, while every tested wider goal produced
          at least one.
        </p>

        <h3 className="subhead">How close must the players be?</h3>
        <p>
          Distance to the <em>opponent</em>, not distance to the goal, is
          what forces a guess. Every one of the 94 no-pure-saddle states has
          the two players within 2 cells of each other:
        </p>
        <div className="stat-grid cols-3">
          <StatTile k="distance 1" value="40" unit="states" />
          <StatTile k="distance 2" value="54" unit="states" />
          <StatTile k="distance &ge; 3" value="0" unit="states" />
        </div>
        <p>Mixing is a local interaction phenomenon in the canonical game.</p>

        <p>
          The switch survives board size, board shape, and where exactly the
          goal sits. It does <em>not</em> survive a different source of
          randomness: give every player a small chance of slipping to a
          random move, and the same forced-mixing behaviour reappears even on
          a single-cell goal. The mechanism is specific &mdash; a coin neither
          player controls, sitting exactly where the carrier has two lanes
          and the defender can only cover one.
        </p>

        <figure className="figure-frame wide">
          <img src={`${BASE}figures/generalize.png`} alt="Generalization chart: the goal-width switch survives board scale, aspect ratio, and goal placement, but breaks under action-independent movement noise." />
          <figcaption>
            how far the switch generalizes &mdash; it survives board scale,
            aspect ratio, and goal placement; it does not survive a change of
            transition family
          </figcaption>
        </figure>

        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/result.md">
            Technical details: the goal-width switch &rarr;
          </a>
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
          move probability), and its full <span className="mono">4&times;4</span>{' '}
          Q matrix, drawn as a node-and-arrow graph &mdash; a lit node is a
          stable outcome, a closed best-response cycle means no pure action
          pair is stable. Five representative cases, read directly off the
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
            equilibrium condition. In 90 of the 94 no-pure-saddle states, the
            matching-pennies core uses a vertical carrier move pair, so the
            dominant geometric pattern is a choice between goal rows.
          </CaseCard>
          <CaseCard tag="Corner duel" state="(0, 0, 1, 1, 0)" title="Players at (0,0) and (1,1) &mdash; sketched at the meeting">
            This is the board position drawn at the meeting, coordinate for
            coordinate: the carrier pinned in the back corner{' '}
            <span className="mono">(0, 0)</span>, the defender diagonally
            adjacent at <span className="mono">(1, 1)</span>. Pinned in the
            corner, the carrier&apos;s two live escapes are straight up the
            sideline or across the back line (<span className="mono">
            U 4.6% / L 95.4%</span>); the defender guesses between them
            (<span className="mono">D 94.9% / L 5.1%</span>). Lopsided, but
            genuinely mixed &mdash; the corner leaves little room, not zero.
          </CaseCard>
          <CaseCard tag="Three-action mix" state="(0, 0, 2, 0, 0)" title="Not a two-way guess at all">
            Support <span className="mono">U 43.3% / L 54.7% / R 1.9%</span>{' '}
            for the carrier, six cells from goal &mdash; as far as this board
            allows. Entropy (1.11 bits) is the richest on this page, but the
            real content is the <span className="mono">4&times;4</span> matrix
            itself: three rows are simultaneously undominated because the
            defender is close enough to threaten all three, so no single row
            is safely better than the others.
          </CaseCard>
          <CaseCard tag="Asymmetric mix" state="(0, 2, 1, 2, 0)" title="Only one player is actually guessing">
            The case worth discussing most. The carrier still mixes two
            actions (<span className="mono">U 2.6% / D 97.4%</span>) but the{' '}
            <strong>defender</strong>&apos;s equilibrium is a single fixed move
            (<span className="mono">R</span>, 100%). Against that fixed R, U
            and D are exactly tied in payoff &mdash; a tie, not a best-reply
            cycle, can look identical to a forced mix in the printed policy,
            but it is a different phenomenon: either pure U or pure D alone
            would also have been a valid equilibrium here. A fractional LP
            output is not automatically a strategically required mixed
            strategy.
          </CaseCard>
          <CaseCard tag="The surprising case" state="(4, 4, 5, 4, 0), deterministic" title="Zero transition randomness &mdash; still forced to mix">
            The earlier examples owe their strategic uncertainty to
            Littman&apos;s random move order: the same pair of chosen moves
            can resolve differently depending on which player moves first.
            Turn that off entirely (fully deterministic
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
          <img src={`${BASE}figures/positions_web.png`} alt="Five boards, one per case above: blue and green discs are the two players, the orange dot is the ball, and arrows show each player's move probabilities." />
          <figcaption>
            the five cases above, drawn: blue = player 0, green = player 1,
            the orange dot is the ball, arrow thickness = probability of that
            move.
          </figcaption>
        </figure>

        <figure className="figure-frame wide">
          <img src={`${BASE}figures/positions_web_matrix.png`} alt="The full 4x4 Q matrix for each of the five cases, drawn as a node-and-arrow graph -- blue arrows show the carrier's reason to switch rows, green arrows the defender's reason to switch columns." />
          <figcaption>
            and the full <span className="mono">4&times;4</span> Q matrix
            behind each one, as a node-and-arrow graph: blue arrows point
            toward the carrier&apos;s better row, green toward the
            defender&apos;s better column. A closed best-response cycle means
            no pure action pair is stable &mdash; every case here, cell by cell.
          </figcaption>
        </figure>

        <div className="callout">
          <p className="callout-quote">
            &ldquo;When we move right and when we move left, there&apos;s an
            equal chance of me winning. That&apos;s why I am indifferent
            between the two.&rdquo;
          </p>
          <p className="callout-body">
            The corner duel above crosses U/L, not L/R, so
            the cleanest match to this exact sentence is a different state,
            (1, 1, 1, 0, 1) &mdash; support exactly <span className="mono">
            {'{L, R}'}</span>, both actions equally good, no vertical option
            in sight (full write-up, Case 3). Either way, a best-reply cycle
            and mutual indifference are the same fact seen from two sides:
            a mixed equilibrium is exactly the strategy pair where every
            action in the support earns the same expected payoff against the
            opponent&apos;s mix &mdash; except in the asymmetric case, where
            it&apos;s a tie, not a cycle, doing the work.
          </p>
        </div>

        <p>
          Seven more cases live in the full write-up: a pure state for
          contrast, a clean L/R-indifference example (support exactly
          {' '}<span className="mono">{'{L, R}'}</span>, matching the quote
          above word for word), the exact <em>mirror</em> of the two-action
          case (value negated to 17 decimal places), a hedge so shallow
          (97.5% / 2.5%) that rounding it to &ldquo;pure&rdquo; would
          misread the game, this project&apos;s own tackle rule producing
          the same duel by a completely different mechanism, the fourth and
          last canonical support shape (the carrier needs three live
          actions, the defender only two &mdash; the single deepest gap of
          any case), and a single-cell goal that is pure across every
          move-order rule tested in the project, forced to mix anyway
          by adding a small chance of any player slipping to a random move
          &mdash; each with its board, its node-and-arrow graph, and its
          exact 4&times;4 Q matrix.{' '}
          <a href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/positions.pdf">
            All twelve cases, as a PDF &rarr;
          </a>
        </p>

        <figure className="figure-frame wide">
          <img src={`${BASE}figures/showcase.png`} alt="Six mixed states drawn as boards with weighted arrows for each player's move probabilities, from a near-even split to a mirror-image symmetry check to the project's own tackle rule." />
        </figure>
      </div>
    </section>
  )
}

function Templates() {
  return (
    <section className="section band" id="templates">
      <div className="section-inner">
        <Eyebrow n="04">The geometry</Eyebrow>
        <h2>Eight patterns explain ninety-four states.</h2>
        <p>
          Are the 94 no-pure-saddle states actually different situations, or
          repeated versions of the same one? Canonicalize each state under
          the board&apos;s mirror symmetry and they collapse to 47 pairs; group
          those by carrier-frame geometry and they collapse again, to just{' '}
          <strong>8 canonical templates</strong>. 94 &rarr; 47 mirror pairs
          &rarr; 8 templates &mdash; a handful of geometric shapes, not
          ninety-four unrelated puzzles.
        </p>
        <figure className="figure-frame wide">
          <img src={`${BASE}figures/templates.png`} alt="One board per matching-pennies template: carrier and defender each with two probability-weighted arrows, covering the 8 geometric templates the 94 no-pure-saddle states reduce to." />
          <figcaption>
            one policy fan per template &mdash; each covers a whole class of
            mixed states related by carrier-frame geometry: the carrier
            choosing between two scoring lanes, the defender guessing which
          </figcaption>
        </figure>
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/templates.md">
            Technical details: the 8 templates &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

function Mechanism() {
  return (
    <section className="section" id="mechanism">
      <div className="section-inner">
        <Eyebrow n="05">Why it happens</Eyebrow>
        <h2>No cell is a stable outcome &mdash; the check needs no solver at all.</h2>
        <p>
          Look at one matchup at a time. Does either player have a single
          move that is at least as good as anything else, no matter what the
          other does? If yes, that move is the obvious answer. If{' '}
          <em>every</em> move can be beaten by some response, the best replies
          chase each other in a loop &mdash; the exact shape of
          rock&ndash;paper&ndash;scissors &mdash; and the equilibrium must randomize
          over the actions in the support.
        </p>
        <figure className="figure-frame">
          <img src={`${BASE}figures/rps_vs_soccer.png`} alt="Rock-paper-scissors next to a real soccer stage game, both showing best replies that cycle with no stable cell." />
          <figcaption>the same cycle, twice &mdash; no learning required to see it, just checking every cell once</figcaption>
        </figure>
        <figure className="figure-frame">
          <img src={`${BASE}figures/mechanism.png`} alt="A mixed stage game's 2 by 2 matching-pennies core drawn as a payoff matrix; each player's best reply flips with the other's choice, the best replies cycle, and no cell is a pure saddle." />
          <figcaption>
            the same cycle, drawn as an actual payoff matrix from the game
            &mdash; every no-pure-saddle state contains one of these
          </figcaption>
        </figure>
        <figure className="figure-frame">
          <img src={`${BASE}figures/rule_fingerprints.png`} alt="Six small boards, one per collision rule, showing where mixed strategies are required." />
          <figcaption>
            different transition and reward mechanisms create different
            spatial fingerprints of strategic mixing
          </figcaption>
        </figure>
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/numerics.md">
            Technical details: numerical robustness &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

function Occupancy() {
  return (
    <section className="section band" id="occupancy">
      <div className="section-inner">
        <Eyebrow n="06">On the equilibrium path</Eyebrow>
        <h2>Rare globally, common in play.</h2>
        <p>
          The 94 no-pure-saddle states are a small corner of the board &mdash;
          but under optimal play from both sides, the game visits that
          corner far more often than its size would suggest.
        </p>
        <div className="stat-grid">
          <StatTile k="of the state space" value="4%" unit="">
            the no-pure-saddle states, as a share of every reachable
            situation on the board.
          </StatTile>
          <StatTile k="discounted equilibrium-path occupancy" value="41%" unit="">
            despite representing only about 4% of the state space.
          </StatTile>
        </div>
        <figure className="figure-frame wide">
          <img src={`${BASE}figures/occupancy.png`} alt="Occupancy chart: the 94 no-pure-saddle states carry 41 percent of the discounted equilibrium-path occupancy despite being about 4 percent of the state space." />
          <figcaption>
            the no-pure-saddle states aren&apos;t a rare corner case &mdash;
            under optimal play they carry a disproportionate share of the
            actual path from kickoff
          </figcaption>
        </figure>
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/occupancy.md">
            Technical details: occupancy on the equilibrium path &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

function WhyItMatters() {
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
        <Eyebrow n="07">Why it matters</Eyebrow>
        <h2>Knowing when to bluff is the difference between winning and losing.</h2>
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
          The tournament below is that lesson made concrete.
        </p>
        <p>
          Four policies are tested against several opponents, from weak
          baselines to a challenger specifically constructed to exploit each
          policy. <strong>Minimax</strong> is the policy this project solves
          for &mdash; it mixes exactly where the theory says it must, and
          stays pure everywhere else. The rest never mix at all.
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
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/tournament_deepdive.md">
            Technical details: the causal deep-dive &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

function Degeneracy() {
  return (
    <section className="section band" id="degeneracy">
      <div className="section-inner">
        <Eyebrow n="08">Reading the LP output</Eyebrow>
        <h2>What the LP output actually means.</h2>
        <p>
          Some probabilities are forced by the game. Others are just one
          point on a larger equilibrium set &mdash; the asymmetric case
          earlier is one example, where a &ldquo;pure&rdquo; 100% move
          actually ties exactly with an unweighted alternative. Sorting all
          94 no-pure-saddle states this way:
        </p>
        <div className="bar-chart" role="img" aria-label="64 of 94 states are a unique forced mix, 16 are a degenerate equilibrium face, 14 have a pure reply tied inside the equilibrium set">
          <div className="bar-track">
            <span className="bar-segment seg-a" style={{ width: '68.1%' }} />
            <span className="bar-segment seg-b" style={{ width: '17.0%' }} />
            <span className="bar-segment seg-c" style={{ width: '14.9%' }} />
          </div>
          <div className="bar-legend">
            <span className="bar-legend-item"><i className="bar-swatch seg-a" />64 unique forced mix</span>
            <span className="bar-legend-item"><i className="bar-swatch seg-b" />16 degenerate equilibrium face</span>
            <span className="bar-legend-item"><i className="bar-swatch seg-c" />14 pure reply tied in the set</span>
          </div>
        </div>
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/degeneracy.md">
            Technical details: forced vs. degenerate &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

const NEURAL_ROWS = [
  { label: 'exact solver', agree: 100, exploit: 0 },
  { label: 'Q-network (best of three)', agree: 59, exploit: 0.36 },
  { label: 'policy network', agree: 96, exploit: 1.20 },
]
const NEURAL_MAX_EXPLOIT = 1.3

function NeuralChart() {
  return (
    <div className="neural-chart">
      <div className="neural-chart-col">
        <p className="neural-chart-label">action agreement (higher = more correct moves named)</p>
        {NEURAL_ROWS.map((r) => (
          <div className="neural-chart-row" key={`a-${r.label}`}>
            <span className="neural-chart-name">{r.label}</span>
            <span className="neural-chart-bar-track">
              <span className="neural-chart-bar agree" style={{ width: `${r.agree}%` }} />
            </span>
            <span className="neural-chart-val">{r.agree}%</span>
          </div>
        ))}
      </div>
      <div className="neural-chart-col">
        <p className="neural-chart-label">exploitability &mdash; duality gap (lower = harder to beat)</p>
        {NEURAL_ROWS.map((r) => (
          <div className="neural-chart-row" key={`e-${r.label}`}>
            <span className="neural-chart-name">{r.label}</span>
            <span className="neural-chart-bar-track">
              <span className="neural-chart-bar exploit" style={{ width: `${(r.exploit / NEURAL_MAX_EXPLOIT) * 100}%` }} />
            </span>
            <span className="neural-chart-val">{r.exploit.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="neural-chart-caption">
        the policy network names the right action almost as often as it
        possibly could, yet is by far the easiest of the three to exploit
        &mdash; high classification accuracy is not the same as strategic
        robustness (random-move-order game, <span className="mono">nash_dqn_random_seeds.csv</span>)
      </p>
    </div>
  )
}

function NeuralLesson() {
  return (
    <section className="section" id="neural">
      <div className="section-inner">
        <Eyebrow n="09">The neural approximation lesson</Eyebrow>
        <h2>Action accuracy is not equilibrium accuracy.</h2>
        <p>
          One more lesson, from trying to get a neural network to learn this
          instead of solving it exactly: a network that names the right move
          almost every time can still be more exploitable than one that gets
          the move wrong more often but hedges correctly where it counts. On
          the harder random-order game below, <strong>the policy network
          reaches 96% action agreement, while the Q-network reaches only
          about 59%</strong> &mdash; yet the policy network is the more
          exploitable of the two.
          <strong> Naming the right action is not the same as playing
          unpredictably</strong> &mdash; the same trap plain single-agent RL
          falls into whenever it is trained to imitate a &ldquo;correct&rdquo;
          move instead of an equilibrium.
        </p>
        <NeuralChart />
        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/report.pdf">
            Technical details: neural Nash-Q (report &sect;8) &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

const TIMELINE = [
  {
    date: '2026-09-06',
    text: 'Environment, exact stage-game solvers, and Nash Q-iteration built; A10 deliverables completed — successor states, a best-response solver, and a bias-free policy network.',
  },
  {
    date: '2026-09-07',
    text: 'The pure-first hybrid solver, mirror symmetry, and the goal-width phase diagram; the 94 mixed states reduced to geometric templates; the first neural Nash-Q comparison.',
  },
  {
    date: '2026-09-08',
    text: 'The one-cell pure-saddle certificate; Littman’s Figure 2 reproduced; the occupancy analysis; the move-order blend sweep.',
  },
  {
    date: '2026-09-09',
    text: 'Littman’s Table 3 tournament reproduced exactly; the goal-width certificate and the generalization study across board scale, aspect ratio, and movement noise; the project’s own tackle rule.',
  },
  {
    date: '2026-09-11',
    text: 'Twelve worked representative positions written up as a PDF; this public site launched.',
  },
  {
    date: '2026-09-13',
    text: 'Neural Nash-Q extended to the genuinely mixed random-order game; a capacity ablation up to 512-wide networks; the 64/16/14 degeneracy split and the distance-1/2 geometry finding; a causal tournament deep-dive; this site corrected and expanded to match.',
  },
]

function Timeline() {
  return (
    <section className="section band" id="timeline">
      <div className="section-inner">
        <Eyebrow n="10">Research updates</Eyebrow>
        <h2>How the project got here.</h2>
        <div className="timeline">
          {TIMELINE.map((t) => (
            <div className="timeline-row" key={t.date}>
              <span className="timeline-date mono">{t.date}</span>
              <span className="timeline-text">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatusAndQuestions() {
  return (
    <section className="section" id="status">
      <div className="section-inner">
        <Eyebrow n="11">Current status</Eyebrow>
        <h2>Where this stands, and what&apos;s still open.</h2>

        <h3 className="subhead">What&apos;s done</h3>
        <p>
          I implemented and evaluated the pure-first Nash-Q solver, designed
          and tested transition and reward variants, developed numerical
          certificates for pure/mixed classification, analyzed the geometry
          of mixed states, reproduced the Littman benchmark, evaluated
          exploitability, and built neural approximations against the exact
          solution.
        </p>

        <h3 className="subhead">Open questions</h3>
        <ul className="question-list">
          <li>
            A board-size-free proof that the single-cell defender&apos;s
            closed-form strategy is optimal is still missing &mdash; the
            empirical certificate holds on every tested board, but a general
            theorem does not exist yet.
          </li>
          <li>
            The mixed states are 4% of the space but 41% of the occupancy
            &mdash; does a solver that spends LP effort in proportion to
            occupancy actually beat uniform value iteration, and can it
            still certify the states it skips?
          </li>
          <li>
            General-sum solving is a sanity check here, not a second research
            direction &mdash; the zero-sum game is where the geometric story
            lives.
          </li>
          <li>
            The actual next challenge is a continuous-action version of this
            game. The discrete work here is what a continuous solver will be
            checked against, not a component it reuses directly &mdash; that
            is future work, not something already solved.
          </li>
        </ul>

        <p>
          <a className="tech-link" href="https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/discussion.md">
            Technical details: open questions in full &rarr;
          </a>
        </p>
      </div>
    </section>
  )
}

const TECH_LINKS = [
  ['Full report (PDF)', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/report.pdf'],
  ['Methods & reproducibility', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/methods.md'],
  ['The goal-width switch', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/result.md'],
  ['Eight geometric templates', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/templates.md'],
  ['Forced vs. degenerate mixes', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/degeneracy.md'],
  ['Numerical robustness', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/numerics.md'],
  ['Occupancy on the equilibrium path', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/occupancy.md'],
  ['Tournament deep-dive', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/tournament_deepdive.md'],
  ['Twelve worked positions (PDF)', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/positions.pdf'],
  ['Open questions', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash/blob/main/docs/discussion.md'],
  ['Source code', 'https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash'],
  ['The technical documentation site', 'https://charith-reddy-pareddy.github.io/soccer-markov-nash/'],
]

function TechnicalLinks() {
  return (
    <section className="section closing" id="links">
      <div className="section-inner">
        <Eyebrow n="12">Go deeper</Eyebrow>
        <h2>Every claim on this page traces back to code and data.</h2>
        <div className="links-grid">
          {TECH_LINKS.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>
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
          Core game-theoretic results are generated by the exact solver;
          neural experiments are evaluated against that ground truth.
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
      <MainFinding />
      <Positions />
      <Templates />
      <Mechanism />
      <Occupancy />
      <WhyItMatters />
      <Degeneracy />
      <NeuralLesson />
      <Timeline />
      <StatusAndQuestions />
      <TechnicalLinks />
      <Footer />
    </>
  )
}
