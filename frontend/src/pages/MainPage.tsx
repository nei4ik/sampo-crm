import { MainContent } from "../components/MainContent"

function MainPage() {

  	return (
		<MainContent>
			<h1 className="text-3xl">
				Asiakasrekisterin harjoittelu
			</h1>
			<p className="py-4">
				Tervetuloa Sampon liiketoiminnan asiakasrekisteriharjoitteluun! Tässä harjoitteluympäristössä opit lisäämään, tarkastelemaan ja muokkaamaan asiakastietoja.
			</p>
			<h2 className="text-2xl">
				Näin käytät harjoitteluympäristöä
			</h2>
			<ol className="py-4 pl-6 list-decimal">
				<li>Kirjaudu sisään omalla käyttäjätunnuksellasi.</li>
				<li>Avaa asiakasrekisteri valitsemalla valikosta <b>Asiakkaat.</b> </li>
				<li>Lisää uusi asiakas ja täytä tiedot opettajan antaman tehtävän mukaisesti.</li>
				<li>Tarkista tietojen oikeellisuus ennen tallentamista.</li>
				<li>Tallenna asiakastiedot. Voit tämän jälkeen tarkastella ja muokata asiakkaan tietoja asiakasrekisterissä.</li>
			</ol>
			<h2 className="text-2xl">
				Muista harjoittelun aikana
			</h2>
			<p className="py-4">
				Käytä vain kuvitteellisia asiakastietoja. Älä tallenna harjoitteluympäristöön oikeiden henkilöiden henkilötietoja tai luottamuksellisia tietoja.
			</p>
		</MainContent>
  	)
}

export default MainPage
