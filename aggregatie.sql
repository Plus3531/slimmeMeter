--verbruik per 10 minuten
select datetime(round(verbruik.datetime / 600) * 600, 'unixepoch') interval, avg(watt)
from verbruik
group by interval;

--verbruik per uur
select datetime(round(verbruik.datetime / 3600) * 3600, 'unixepoch') interval, avg(watt)
from verbruik
group by interval;

--verbruik per dag
select datetime(round(verbruik.datetime / 86400) * 86400, 'unixepoch') interval, avg(watt)
from verbruik
group by interval;

--verbruik per dag
select datetime(round(verbruik.datetime / 86400) * 86400, 'unixepoch') interval, avg(watt)
from verbruik
where verbruik.datetime < 1425763728 and verbruik.datetime > 1425745891
group by interval;

--verbruik gas, deze query is traag zonder index op datetime
SELECT
   [current].datetime,
   [current].gas,
   ([next].gas - [current].gas) diff
FROM
   standen       as [current]
LEFT JOIN
   standen       as [next]
      ON [next].datetime = (SELECT MIN(standen.datetime) FROM standen WHERE standen.datetime > [current].datetime)