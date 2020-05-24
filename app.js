"use strict"

let radioButtons = document.querySelectorAll('.radio');
let divChoose = document.querySelector('.choose')
let search = document.querySelector('.search')

const categoriesList = document.querySelectorAll('.category')

const favouriteList = document.querySelector('.favouriteList')
const joke = document.querySelector('.joke')

const phrase = document.querySelector('.phrase')

const buttonGetJoke = document.querySelector('.getJoke')
const divJoke = document.querySelector('.divJoke')
const fullInf = document.querySelector('.fullInf')
const jokes = document.querySelector('.jokes')

let divCategory = document.querySelector('.categ')
const favOpen = document.querySelector('.fav-open')

radioButtons.forEach( radioButton => {
    radioButton.addEventListener('click', () => {
        if (radioButtons[1].checked) {
            divChoose.style.display = 'block'
            search.style.display = 'none'
        } else if (radioButtons[2].checked) {
            search.style.display = 'block'
            divChoose.style.display = 'none'
        } else if (radioButtons[0]) {
            search.style.display = 'none'
            divChoose.style.display = 'none'
        }
    })
})

categoriesList.forEach((category) => {

    category.addEventListener('click', () => {
        categoriesList.forEach((categ) => {
            categ.classList.remove('active')
        })
        category.classList.toggle('active')
    })
})



const identifyID = document.querySelector('.identifyID')

function doNewJoke(data) {
    const divJokeNew = joke.cloneNode(true)
    const heart = joke.querySelector('.heart')
    heart.classList.remove('liked')
    
    jokes.prepend(divJokeNew)
    // console.log(divJokeNew);
    // console.log(joke);
    
    
    
    joke.style.display = 'block'
    // if(divJokeNew.dataset.id !== undefined) {
    //     divJokeNew.style.display = 'block'
    // }
    
    
    
    divJokeNew.classList.add('joke')
    phrase.textContent = data.value
    //ID
    const identifyID = document.querySelector('.identifyID')
    identifyID.textContent = data.id

    //
    joke.dataset.id = data.id
    

    //update
    const updateDate = new Date(`${data.updated_at}`)
    const updateHours = Math.round(updateDate/1000/60/60)
    const updateP = document.querySelector('.update')
    updateP.textContent = `Last update: ${updateHours} hours ago`
    //category
     
    if(data.categories.length > 0) {
        divCategory.style.display = 'inline'
        divCategory.textContent = data.categories[0]
    } else {
        divCategory.style.display = 'none'
    }
}

buttonGetJoke.addEventListener('click', () => {
    if(radioButtons[0].checked) {
        fetch('https://api.chucknorris.io/jokes/random')
        .then((response) => {
            return response.json()
            phrase.textContent = ''
        })
        .then((data) => {
            doNewJoke(data)
        })
    }

    let mustBeCategory

    if (radioButtons[1].checked) {
        categoriesList.forEach((category) => {
        if(category.classList.value.includes('active')) {
            mustBeCategory = category.textContent
            return mustBeCategory
        }
    })

        fetch(`https://api.chucknorris.io/jokes/random?category=${mustBeCategory}`)
            .then((response) => {
                return response.json()
                phrase.textContent = ''
            })
            .then((data) => {
                doNewJoke(data)
            })
    }

    if(radioButtons[2].checked) {
        console.log(search.value)
        fetch(`https://api.chucknorris.io/jokes/search?query=${search.value}`)
        
            .then((response) => {
                return response.json()
                phrase.textContent = ''
            })
            .then((data) => {
                const total = data.total;
                const randomOfTotal =Math.floor (Math.random() * total)

                data = data.result[randomOfTotal]

                doNewJoke(data)
            })
    }
})

function makeRedHeart(event, a) {
    event = event || window.event
    event.target.classList.add('heart-full')
}

function notMakeRedHeart(event, a) {
    event = event || window.event
    event.target.classList.remove('heart-full')
}


let allToStorage = JSON.parse(localStorage.getItem('jokes')) || []

function clickRedHeart(event, a) {
    event = event || window.event
    const id = event.target.parentNode.dataset.id

    if(event.target.classList.contains('liked')) {
        console.log(true);
        const touchedJokesList = document.querySelectorAll(`[data-id='${id}']`);
        console.log(touchedJokesList);
        if(touchedJokesList.length > 1) {
            const heartToStay1 = touchedJokesList[0].querySelector('.heart')
            
            heartToStay1.classList.forEach((classItem) => {
                if(classItem == 'liked') {
                    classItem = ''
                }
                
            })

            // console.log(heartToStay1.classList);
            
            // heartToStay1.classList.remove('liked')
            console.log(heartToStay1);
        } else {
            console.log('oops');
            touchedJokesList[0].remove()
            
        }
        
        // const heartToStay1 = jokeToStay1.querySelector('.heart')
        // heartToStay1.classList.remove('liked')
        // console.log(heartToStay1);

        // heartToStay1.classList.remove('liked')


        let savedJokes = JSON.parse(localStorage.getItem('jokes'))
        console.log(savedJokes);
        let allSavedJokes = savedJokes.filter((joke) => {
            if(!joke.body.includes(id)) {
                return joke
            }
            
            // if(joke.dataset.id != id) {
            //     return joke
            // }
        })        

        localStorage.setItem(`jokes`, JSON.stringify(allSavedJokes))



        event.target.classList.toggle('liked')

        // console.log(id);
        
        const toDelete = document.querySelectorAll(`[data-id='${id}']`)

        const heartToStay = toDelete[0]
        if(toDelete.length > 1) {
            const jokeToDelete = toDelete[1]
            jokeToDelete.remove()
        }
        // console.log(document.querySelectorAll(`[data-id='${id}']`));
        

        
        return
    }
    

    const divNewJoke = event.target.parentNode.cloneNode(true)
    
    divNewJoke.style.backgroundColor = '#FFFFFF'
        
    let divCategory = divNewJoke.querySelector('.categ')
    let messageBg = divNewJoke.querySelector('.message-bg')
    let messageBgFav = divNewJoke.querySelector('.message-bg-fav')
    messageBgFav.style.display = 'inline'

    const heart = divNewJoke.querySelector('.heart')
    heart.classList.remove('heart-full')
    heart.classList.add('liked')

    divCategory.style.backgroundColor = '#F8F8F8'

    favouriteList.prepend(divNewJoke)
    event.target.classList.toggle('liked')

    let jokeToStorage = {
        id: divNewJoke.id,
        body: divNewJoke.outerHTML 
    }
    allToStorage.push(jokeToStorage)

    localStorage.setItem(`jokes`, JSON.stringify(allToStorage))

}

function click() {
    setTimeout(() => {
        buttonGetJoke.click()
    }, 0);
}

click()
let oldJokesText = ''
for(let i = allToStorage.length - 1; i >= 0; i--) {
    oldJokesText += allToStorage[i].body
}
// console.log(oldJokesText);

favouriteList.innerHTML = oldJokesText

// favOpen.addEventListener('click', () => {
//     const sidebar = document.querySelector('.sidebar')
//     sidebar.classList.toggle('active')
// })

function setup_for_width(x) {
	if (x.matches) {
		$('#exampleModal').addClass("modal left fade");
		$('#exampleModal').removeClass("col-md-4 offset-md-1");
		$('#test11 ').css('display','flex');
		$('#exampleModal').css('display','none');
		$('.favorite').css('width','480px');
		$('.favorite').css('background','');
		$('.favorite__btnmenu').css('display','inline-block');
		$('.modal-content').css('padding','40px');
		$('.favorite__favorite').css('justify-content','flex-end');
	} else {
		$('#exampleModal').css('display','block');
		$('#exampleModal').addClass("col-md-4 offset-md-1");
		$('#exampleModal').removeClass("modal left fade");
		$('#test11 ').css('display','none');
		$('.favorite').css('width','');
		$('.favorite__btnmenu').css('display','none');
		$('.favorite').css('background','#f8f8f8');
		$('.modal-content').css('padding','');
		$('.favorite__favorite').css('justify-content','flex-start');


	}
};

var tabl = window.matchMedia("screen and (max-width: 767px)");
// var phon = window.matchMedia("screen and (min-width: 576px)");

setup_for_width(tabl);
tabl.addListener(setup_for_width);