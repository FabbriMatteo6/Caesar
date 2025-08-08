# Game Design Document: Il Palazzo: The Italian Political Simulator

## 1. Core Concept

**Title:** Il Palazzo: The Italian Political Simulator

**Genre:** Political Simulation, Strategy

**Platform:** Web Browser (Desktop and Mobile-responsive)

**Target Audience:** Players interested in strategy, simulation games, and political dynamics.

**Logline:** Navigate the treacherous and complex world of Italian politics, rise from a local mayor to the Prime Minister, and shape the future of the nation.

"Il Palazzo" is a single-player, web-based simulation game where the player steps into the shoes of an aspiring Italian politician. The game is a balancing act of managing public opinion, state finances, and political influence. Starting from a humble local position, the player must make difficult decisions, forge alliances, and navigate a dynamic system of events to climb the political ladder. The ultimate goal is to reach the pinnacle of Italian power—the office of Prime Minister—and successfully lead the country.

The game aims for a tone of serious realism, reflecting the intricate and often dramatic nature of Italian politics, while remaining an engaging and accessible gameplay experience.

## 2. Core Player Statistics/Resources

The player's success is measured by their ability to manage three primary resources:

*   **Public Approval (%)**: This represents the public's satisfaction with the player's performance.
    *   **Mechanics:** It is tracked at the local, regional, and national levels. High approval is crucial for winning elections and maintaining power. It is influenced by policy decisions (e.g., popular social programs boost it, austerity measures lower it), public appearances, media management, and the outcomes of events. Sustained low approval can lead to protests, loss of political capital, and ultimately, removal from office.
    *   **Influencers:** Economic performance, unemployment rates, crime rates, successful/failed legislation.

*   **Budget & Economy (€)**: This resource reflects the financial health of the player's jurisdiction (town, region, or nation).
    *   **Mechanics:** Players manage income (taxes, federal/regional grants) and expenditures (healthcare, infrastructure, education, security, etc.). They can set tax rates, issue bonds (increasing debt), and make strategic investments. A well-managed budget can lead to a surplus, unlocking opportunities for popular projects. Mismanagement can lead to deficits, debt crises, and eventual bankruptcy—a game-loss condition.
    *   **Influencers:** Macroeconomic trends, investment returns, unforeseen costs from disasters.

*   **Political Capital (Ψ)**: An abstract resource representing a player's influence, network, and political leverage.
    *   **Mechanics:** Political Capital is the currency of power. It is spent to perform difficult political maneuvers: convincing rival parties to support a bill, appointing allies to key positions, pushing through controversial but necessary reforms, or surviving a no-confidence vote.
    *   **Gaining/Losing:** It is earned by winning elections, successful negotiations, passing popular legislation, and skillfully handling political crises. It is lost when making unpopular compromises, losing key legislative votes, or through political scandals.

## 3. Player Actions

The player interacts with the game world through a core set of actions available each turn:

*   **Legislation:** Propose, support, or veto laws. Laws are categorized (e.g., Economy, Social Policy, Environment, Foreign Policy) and have explicit effects on the three core resources. Passing a law requires building a coalition and spending Political Capital.
*   **Public Engagement:** Manage public perception.
    *   **Speeches/Press Conferences:** Address the public on key issues to boost approval. The effectiveness depends on the player's current approval and the topic's popularity.
    *   **Social Media Management:** Run targeted campaigns to sway public opinion on specific issues or bolster general approval.
*   **Negotiations:** Engage in backroom dealings. Meet with leaders of other political parties, unions, or corporate interest groups. The goal is to build coalitions, secure votes for legislation, or request support during a crisis. These actions cost Political Capital but are essential for progress.
*   **Campaigning:** Run for office in elections. This is a special game phase involving:
    *   **Fundraising:** Raise money for the campaign.
    *   **Advertising:** Run ads to attack opponents or promote one's own platform.
    *   **Debates:** Participate in debates, where performance can significantly swing public approval.
*   **Budget Management:** Access a dedicated screen to allocate funds. Adjust tax rates, increase/decrease spending in various sectors (e.g., Healthcare, Education, Infrastructure, Police), and manage government debt.

## 4. Career Progression

The player's career is a linear progression through four distinct stages, each with increasing complexity and scope.

1.  **Sindaco (Mayor):** The game starts here. The player manages a small Italian town.
    *   **Focus:** Local issues like waste management, local policing, primary education, and zoning laws.
    *   **Challenge:** Limited budget and direct accountability to a small, vocal populace. A training ground for the core mechanics.
2.  **Regional President:** After a successful term as Mayor, the player can run for President of their region.
    *   **Focus:** Broader issues like regional healthcare systems, transportation networks, and attracting investment.
    *   **Challenge:** Managing a much larger budget and diverse demographics. Must balance the needs of multiple towns and cities within the region.
3.  **Member of Parliament (Deputato/Senatore):** The player moves to the national stage in Rome.
    *   **Focus:** National legislation, party politics, and committee assignments. The player's direct control over budgets is reduced, replaced by influence over national policy.
    *   **Challenge:** Success is defined by legislative achievements and influence within the party. The player must master negotiation and coalition-building.
4.  **Presidente del Consiglio (Prime Minister):** The ultimate goal.
    *   **Focus:** Leading the national government, managing the cabinet, setting the national agenda, handling international relations, and overseeing the entire national economy.
    *   **Challenge:** The most complex stage. The player must maintain a stable coalition government, respond to major national and international crises, and secure a legacy.

## 5. Dynamic Event System

The game world is kept unpredictable and challenging through a robust event system.

*   **Consequence-Based Events:** These events are direct results of player actions.
    *   *Example:* Passing a strict environmental law could trigger a "Factory Closure" event, leading to a local unemployment crisis. Conversely, investing in tech infrastructure might trigger a "Tech Boom" event, boosting the economy.
*   **Randomized Events:** Unforeseen "black swan" events that test the player's adaptability.
    *   *Example:* A sudden global recession, a natural disaster (earthquake, flood), a major political scandal involving an allied party, or a diplomatic crisis with a neighboring country.
*   **Influencing Variables:** The game state is shaped by underlying, slowly changing variables that influence the probability and impact of events. These include:
    *   **Geographical Location:** A northern industrial region will face different challenges than a southern agricultural one.
    *   **Macroeconomic Indicators:** Global oil prices, EU economic health, and inflation rates will impact the national budget.
    *   **National Health Crises:** A pandemic could strain healthcare budgets and plummet public approval.
    *   **Demographic Shifts:** An aging population will increase pension and healthcare costs over time.

## 6. Win/Loss Conditions

The game has clear objectives and failure states.

*   **Win Condition:**
    1.  Successfully become Prime Minister.
    2.  Maintain a stable coalition government (avoiding a vote of no confidence).
    3.  Serve a full 5-year term with an average Public Approval rating above 50%.

*   **Loss Conditions:**
    *   **Electoral Defeat:** Losing an election at any stage of the career path.
    *   **Vote of No Confidence:** Being removed from office by a parliamentary vote (as MP or PM).
    *   **Government Bankruptcy:** Accumulating unsustainable debt and defaulting.
    *   **Critical Approval Loss:** Allowing Public Approval to drop below 10% for a sustained period (e.g., 6 months), leading to a forced resignation.
