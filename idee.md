Ich sdchreibe hier mal gerade runter was ich vorhabe.

Meine Freunde und ich spielen gerne ein Spiel bei dem einer eine Bibelstelle raussucht, sie vorliest und wir dann raten müssen, wo diese Stelle in der Bibel steht.
Wer am nähsten dran ist hat gewonnen. 

Ich will das jetzt automatisieren und als leichte Web-App zur Verfügung stellen.
Dazu soll ein Vers random ausgewählt werden, er soll dann bei allen auf dem Smartphone angezeigt werden.
Danach soll jeder die Möglichkeit haben über ein Bibelregister (evtl. kann das ein Dropdown sein) die Bibelstelle auszuwählen
Testament | Buch | Kapitel | Vers

Das Register soll sich an den vorhandenen Bibelversen richten. 
Ich habe eine CSV Version oder auch eine sqlite Datei, die die Bibel enthält.

Zuerst möchte ich das nur alleine spielen können. Später möchte ich das so weiterentwickeln, dass ich mit mehreren Leuten die gleichen Bibelstellen angezeigt bekomme, es gibt kein Punktesystem. Jeder kann für sich weiterklicken. Es gibt keine zu starke Abhängigkeit zueinander.
Im einfachsten Fall wird jeden Tag eine Liste generiert mit 100 Stellen und man kann auswählen, ob man komplett Random oder die Liste spielen möchte.

Diese Liste möchte ich für spezielle Events über eine CSV oder JSON oder Config wie auch immer selbst für ein Datum hochladen können. (Das soll aber erstmal ein zukunftsfeature sein, noch nicht entwickeln!)

Das ganze soll erstmal so ausgelegt werden, dass maximal 10 Leute parallel spielen.

Ich habe schon eine eigene Domain und möchte da jetzt endlich was hosten.
Für die Entwicklung möchte ich aber erstmal alles lokal entwickeln und testen.

