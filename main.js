let scopeImg = document.querySelector('#scope')
scopeImg.style.top = 0 + 'px';
scopeImg.style.left = 0 + 'px';

let shotsNumber = document.querySelector('#shots')
let hitMessage = document.querySelector('#hitMessage')

let targetImg = document.querySelector('#target')
targetImg.style.width = 300 + 'px';
targetImg.style.height = 300 + 'px';

let scoring = document.querySelector('#scoring')

let bullet = document.querySelector('#bullet-hole')
bullet.style.width = '24px';
bullet.style.height = '24px';

function Scope(scopeImg) {
    let scopePassedX = 0; //пройденая прицелом дистанция по
    let scopePassedY = 0;
    this.stepX = 1; //шаг для дистпнции
    this.stepY = 1;
    this.movingStart = () => { //метод активирующий движение прицела
        this.move = setInterval(() => {
            let updateScopePosition = (x, radius) => {
                this.currentPositionX = this.mousePosX + scopePassedX + x;
                this.currentPositionY = this.mousePosY + scopePassedY + radius;
                this.scopeCenterX = this.currentPositionX + 50;
                this.scopeCenterY = this.currentPositionY + 50;
                scopeImg.style.left = this.currentPositionX + 'px';
                scopeImg.style.top = this.currentPositionY + 'px';
            }
            scopePassedX += this.stepX;
            scopePassedY += this.stepY;
            updateScopePosition(this.stepX, this.stepY)
            if (scopePassedY > 100 || scopePassedY < -150) {
                scopePassedY = scopePassedY > 0 ? 100 : -150
                this.stepY = -this.stepY;
            };
            if (scopePassedX > 120 || scopePassedX < -240) {
                scopePassedX = scopePassedX > 0 ? 120 : -240
                this.stepX = -this.stepX;
            };
        }, 10)
    };
    document.body.addEventListener('mousemove', (event) => { //отслеживаем движение мыши
        this.mousePosX = event.clientX;
        this.mousePosY = event.clientY;
    });
    this.movingStop = () => {
        clearInterval(this.move)
    };

    document.body.addEventListener('mousedown', () => {
        this.movingStart()
        let audio = new Audio('./sound/reloading.mp3');
        audio.play();
    })
    document.body.addEventListener('mouseup', () => {
        this.movingStop()
        //audio
        let audio = new Audio('./sound/shot.mp3');
        audio.play();
        shotsNumber.textContent = shotsNumber.textContent === '' ? 1 : Number(shotsNumber.textContent) + 1;
        //просчёт попадания
        let differenceX = this.scopeCenterX - target.centerX;
        let differenceY = this.scopeCenterY - target.centerY;
        let targetAll = 10; //сколько всего делений
        let targetRadiusAll = parseInt(targetImg.style.width) / 2 //радиус цели
        let step = targetRadiusAll / targetAll; //шаг
        let radius = step; //начальное значение 
        let arr = []; //все промежутки 

        for (let i = 10; i >= 0; i--) {
            arr.push({
                radius: radius,
                score: i,
            });
            radius += step;
        }
        let radiusOfHit = Math.sqrt(differenceX ** 2 + differenceY ** 2); //радиус места попадания        
        for (let key of arr) {
            if (radiusOfHit <= key.radius) {
                scoring.textContent = scoring.textContent === '' ? key.score : Number(scoring.textContent) + key.score;
                if (key.score != 0) {
                    //след от пули
                    bullet.style.display = 'block';
                    bullet.style.top = this.scopeCenterY - parseInt(bullet.style.height) / 2 + 'px'
                    bullet.style.left = this.scopeCenterX - parseInt(bullet.style.width) / 2 + 'px'
                    //сообщение
                    hitMessage.style.display = 'block'
                    setInterval(()=>hitMessage.style.display = 'none', 500);
                }
                break;
            }
        }
    })
}

function Target(targetDomElem) { //конструктор целей
    //позиционирование
    this.positionX = targetDomElem.offsetLeft;
    this.positionY = targetDomElem.offsetTop;
    this.centerX = this.positionX + (parseInt(targetDomElem.style.width) / 2);
    this.centerY = this.positionY + (parseInt(targetDomElem.style.width) / 2);
}

let target = new Target(targetImg);
let scope = new Scope(scopeImg);