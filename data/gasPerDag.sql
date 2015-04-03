select datetime(round(standen.datetime /  86400 ) *  86400, 'unixepoch') dag, max(gas) m3  
from standen  
group by dag;


SELECT [current].ue tijdstip, [current].m3 meterstand,  round((([next].m3- [current].m3)*1000)) verbruik 
FROM  gasmeterPerDag as [current] LEFT JOIN gasmeterPerDag as [next]  ON [next].ue = (SELECT MIN(gasmeterPerDag.ue) FROM gasmeterPerDag  WHERE gasmeterPerDag.ue > [current].ue) 


SELECT date([current].ue, 'unixepoch') dag, [current].m3 meterstand,  round((([next].m3- [current].m3)*1000)) verbruik 
FROM  gasmeterPerDag as [current] LEFT JOIN gasmeterPerDag as [next]  ON [next].ue = (SELECT MIN(gasmeterPerDag.ue) FROM gasmeterPerDag  WHERE gasmeterPerDag.ue > [current].ue) 

Select * from gasPerDag where dag > date('2015-03-10')