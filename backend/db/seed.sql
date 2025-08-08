-- Seed data for Il Palazzo

-- Seed Regions
INSERT INTO regions (name, population, gdp_per_capita, base_approval) VALUES
('Lombardy', 10060574, 39700, 55.0),
('Lazio', 5879082, 33400, 52.5),
('Campania', 5801692, 18500, 48.0),
('Sicily', 4999891, 17200, 45.5),
('Veneto', 4905854, 34100, 58.0);

-- Seed Policies (Category: Economy)
INSERT INTO policies (name, description, category, effects) VALUES
('Cut Corporate Tax', 'Lower the corporate tax rate by 5% to attract businesses.', 'Economy',
'{"budget_balance": -500000, "public_approval": -2, "political_capital": 5}'),
('Invest in Green Energy', 'Fund new solar and wind farm projects across the region.', 'Economy',
'{"budget_balance": -1200000, "public_approval": 4, "political_capital": -3}'),
('Raise Minimum Wage', 'Increase the minimum hourly wage by 10%.', 'Economy',
'{"budget_balance": -300000, "public_approval": 5, "political_capital": -4}');

-- Seed Policies (Category: Social)
INSERT INTO policies (name, description, category, effects) VALUES
('Expand Public Healthcare', 'Increase funding for public hospitals and clinics.', 'Social',
'{"budget_balance": -800000, "public_approval": 6, "political_capital": -2}'),
('Stricter Immigration Rules', 'Implement stricter controls on new immigration.', 'Social',
'{"budget_balance": 50000, "public_approval": -3, "political_capital": 6}'),
('Fund Public Universities', 'Increase state funding for higher education.', 'Social',
'{"budget_balance": -600000, "public_approval": 3, "political_capital": -1}');

-- Seed Events (Random)
INSERT INTO events (name, description, type, choices) VALUES
('Factory Fire', 'A major factory in your region has caught fire, leading to significant job losses and environmental concerns.', 'random',
'[
  {"choice_id": 1, "text": "Offer emergency funds to the factory owner.", "effects": {"budget_balance": -500000, "public_approval": 2}},
  {"choice_id": 2, "text": "Prioritize environmental cleanup and worker support.", "effects": {"budget_balance": -300000, "public_approval": 4}},
  {"choice_id": 3, "text": "Do nothing and let insurance handle it.", "effects": {"budget_balance": 0, "public_approval": -5}}
]'),
('Unexpected Surplus', 'Due to a calculation error in your favor, the treasury has found an unexpected surplus.', 'random',
'[
  {"choice_id": 1, "text": "Announce a one-time tax rebate for all citizens.", "effects": {"budget_balance": -1000000, "public_approval": 8}},
  {"choice_id": 2, "text": "Invest it in infrastructure projects.", "effects": {"budget_balance": -1000000, "public_approval": 4}},
  {"choice_id": 3, "text": "Use it to pay down government debt.", "effects": {"budget_balance": -1000000, "public_approval": 1}}
]'),
('Political Scandal', 'A minor member of your party is embroiled in a corruption scandal, and the media is asking for your comment.', 'random',
'[
  {"choice_id": 1, "text": "Defend your party member publicly.", "effects": {"political_capital": 5, "public_approval": -4}},
  {"choice_id": 2, "text": "Demand their resignation immediately.", "effects": {"political_capital": -5, "public_approval": 3}},
  {"choice_id": 3, "text": "Offer no comment and wait for it to blow over.", "effects": {"political_capital": 0, "public_approval": -2}}
]');
