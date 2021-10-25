
{
    const introButton = document.querySelector(`.intro__button`);


    const start = () => {
        introButton.addEventListener('click', function(){
            introButton.href = "start.html";
        })
        ;
    }

    const next = () => {
        document.querySelector(`.intro__text__first`).textContent = `your mission is simple:`;
        document.querySelector(`.intro__text__second`).classList.add('mission')
        document.querySelector(`.intro__text__second`).textContent = `help Icarus fly together with his father over the ocean to Sicily.`;
        introButton.textContent = `start`;
        introButton.classList.add = 'intro__button--start';
        introButton.onclick = start();
    }

    const init = async () => {
        introButton.addEventListener('click', next);

        //window.addEventListener('click', playMusic)
    };

    init();
}