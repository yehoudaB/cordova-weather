class WeatherApp extends DefaultElement {

	dateNow = new Date();
	dayOfWeek = this.dateNow.getDay();
	days = ['dimanche','Lundi', 'mardi','mercredi','jeudi','vendredi','samedi'];
	hours= this.dateNow.getHours();
	minutes = this.dateNow.getUTCMinutes()
	cityToSearch = '';
	
	
    connectedCallback() {
        super.connectedCallback(...arguments);
        this.isDeviceReady = false;

        document.addEventListener('deviceready', () => {
			this.isDeviceReady = true;
			this.geoLocation();
			this.geoLocationDays();
			this.searchCity();
			this.searchCityOthersDays()
			
    		console.log('deviceready')
        }, false);

	}


	searchCity(){
		
		document.getElementById('button').addEventListener('click', ()=>{
			this.cityToSearch = document.getElementById('cityToSearch').value;

			console.log(this.cityToSearch)
			if(this.cityToSearch.length > 1){

				let url = '//api.openweathermap.org/data/2.5/weather';
				url += '?appid=' + this.dataset.key;
				url += '&units=metric' // <= Celsius
				url += '&lang=fr'
				url += '&q='+ this.cityToSearch
	
	
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onload = () => {
					let data = JSON.parse(xhr.responseText);
					console.log(data)
					
					if( data.cod === '404')
						document.querySelector('.alert').style.visibility = 'visible'
					else{
						this.setData(data);
						document.querySelector('.alert').style.visibility = 'hidden'
					}
				};


				

			}
			else{	
				document.querySelector('.alert').style.visibility = 'visible'
			}
			
		})
	}
	

	searchCityOthersDays(){
		
		document.getElementById('button').addEventListener('click', ()=>{
			this.cityToSearch = document.getElementById('cityToSearch').value;

			console.log(this.cityToSearch)
			if(this.cityToSearch.length > 1){

				let url =  '//api.openweathermap.org/data/2.5/forecast?';
				url += '&q=' + this.cityToSearch
				url += '&units=metric' // <= Celsius
				url += '&lang=fr'
				url += '&appid=' + this.dataset.key

				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onload = () => {
					let data = JSON.parse(xhr.responseText);
					console.log(data)
					if( data.cod !== '404')
						this.setDataOthersDays(data);
				};
			}
		})
	}

	

    geoLocation(){
    	
		navigator.geolocation.getCurrentPosition((position) => {
			console.log(position);

			let url = '//api.openweathermap.org/data/2.5/weather';
			url += '?appid=' + this.dataset.key;
			url += '&units=metric' // <= Celsius
			url += '&lang=fr'
			url += '&lat=' + position.coords.latitude
			url += '&lon=' + position.coords.longitude
				
			let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onload = () => {
					let data = JSON.parse(xhr.responseText);
					console.log(data)
					this.setData(data);

			};
		});
	}
	
	
	getCurrentDay(){
        return this.days[this.dayOfWeek];
	}

	getCurrentHour(){
		return this.hours +':'+ this.minutes;
	}
	
	
	
	
	setData(data){
		document.getElementById('day').textContent = this.getCurrentDay();
		document.getElementById('hour').textContent = this.getCurrentHour();
		document.getElementById('hour').textContent = this.getCurrentHour();
		document.getElementById('skyDescription').textContent = data.weather[0].description;
		document.getElementById('icon').src = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon +'@2x.png'
		document.getElementById('city').textContent = data.name
		document.getElementById('pressure').textContent = data.main.pressure
		document.getElementById('temp').textContent = data.main.temp
		document.getElementById('humidity').textContent = data.main.humidity
		document.getElementById('feels_like').textContent = data.main.feels_like
		document.getElementById('temp_min').textContent = data.main.temp_min
		document.getElementById('temp_max').textContent = data.main.temp_max

	}


	geoLocationDays(){

		navigator.geolocation.getCurrentPosition((position) => {

			let url =  '//api.openweathermap.org/data/2.5/forecast?';
				
				url += 'lat=' + position.coords.latitude
				url += '&lon=' + position.coords.longitude
				url += '&units=metric' // <= Celsius
				url += '&lang=fr'
				url += '&appid=' + this.dataset.key

				
				console.log(url)

			let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onload = () => {
					let data = JSON.parse(xhr.responseText);
				
					this.setDataOthersDays(data);

			};
		});
	}


	setDataOthersDays(data){
		let dataPerDay = [];
		let h = data.list[0].dt_txt.slice(11,19)
		console.log(h)
		for (let i = 0; i < data.list.length; i++) {
			//console.log(data.list[i].dt_txt.slice(0,10).localeCompare(data.list[i+1].dt_txt.slice(0,10)) )
			
			
			if(data.list[i].dt_txt.includes(h) && i > 0 ){
				dataPerDay.push(data.list[i])
				console.log(data.list[i].dt_txt)
				console.log(data.city.name)
			}

			
			
		}
		console.log(dataPerDay)
		
		let cardDays = document.querySelectorAll('#cardDay');
		let i= this.dayOfWeek
		cardDays.forEach(cardDay => {
			if(i<6)
				i++;
			else
				i =0
			cardDay.innerHTML = this.days[i];
			
		});

		let cardTemps = document.querySelectorAll('#cardTemp');		
		let j = 0
		cardTemps.forEach(cardTemp => {
			
			cardTemp.innerHTML = dataPerDay[j].main.temp
			j++;
		});

		
		let cardIcons = document.querySelectorAll('#cardIcon');		
		let k = 0; 
		cardIcons.forEach(cardIcon => {
			
			cardIcon.src = 'http://openweathermap.org/img/wn/'+ dataPerDay[k].weather[0].icon +'@2x.png'
			k++;

		});

		let l= 0;
		document.querySelectorAll('.collapse').forEach(element =>{
			element.querySelector('#skyDescription').textContent = dataPerDay[l].weather[0].description;
			element.querySelector('#pressure').textContent = dataPerDay[l].main.pressure
			element.querySelector('#humidity').textContent = dataPerDay[l].main.humidity
			element.querySelector('#feels_like').textContent = dataPerDay[l].main.feels_like
			element.querySelector('#temp_min').textContent = dataPerDay[l].main.temp_min
			element.querySelector('#temp_max').textContent = dataPerDay[l].main.temp_max 

			l++;
		});
	}
}

customElements.define('weather-app', WeatherApp);

