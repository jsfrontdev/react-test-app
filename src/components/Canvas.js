import React, { Component } from 'react';
//import '../data/precipitation.json';
//import '../libs/workers/calculation.js';

const MIN_LIM = 1881;
const MAX_LIM = 2006;

class Btn extends Component{

    constructor(props){
        super(props);
        this.btnClick = this.btnClick.bind(this);
        this.state = {
            activeClass: false
        }
    }

    btnClick(e){

        let box = document.querySelectorAll('.content__select-data')[0];
        let slider = document.querySelectorAll('.content__trigr-animate')[0];
        let self = this;

        if(!this.slider)
            this.slider = document.querySelectorAll('.content__trigr-animate')[0];

        this.props.self.identifier = this.props.name;
        this.props.self.chekLocalStor(this.props.name);

        slider.setAttribute('style','transform:translateX('+Math.round(e.target.getBoundingClientRect().left - box.getBoundingClientRect().left)+'px);')

    }

    render(){
        let name;
        let activeBtn = '';
        let classActive = 'btn-type';
        let self = this;

        if(this.props.name === 'precipitation') { name = 'Осадки';}
        else { name = 'Температура';  }
        return(
            <a onClick={this.btnClick} data-type={this.props.name} className={classActive}>{name}</a>
    );
    }

}

class Canvas extends Component{

    constructor (props){

        super(props);

        this.setSelect = this.setSelect.bind(this);
        this.state = {ajaxLoad: false};
        this.state = {pageLoaded: true, delay: true};
        //this.state = {delay: true};

    }

    chekLocalStor(e){

        if(!localStorage.getItem('data_'+e+'')){

            this.getData(e);
        }
        else{
            this.identifier = e;
            if(!this['data_'+ e +''])
                this['data_'+ e +''] = JSON.parse(localStorage.getItem('data_'+e+''));
            this.calcData();
        }
    }

    setSelect(e){

        if (e.target == undefined) {

            this.setDatas = [arguments[0], arguments[1]];
        } else {
            if (e.target.getAttribute('select-type') == '0') {
                this.setDatas = [e.target.value, e.target.nextElementSibling.value];
            } else {
                this.setDatas = [e.target.previousElementSibling.value, e.target.value];
            }
            this.calcData();
        }

    }

    calcData(data){

        let self = this;

        if (window.Worker) {

            if (!localStorage.getItem('data_years_' + this.identifier + '(' + self.setDatas[0] + '-' + self.setDatas[1] + ')')) {
                togglePreloader(false);
                let newWorker = function () {
                    return new Promise(function (resolve, reject) {
                        let worker;
                        worker = new window.Worker('workers/calculation.js');
                        worker.postMessage([self.identifier, self.setDatas, self['data_'+self.identifier+'']]);
                        worker.onmessage = function (event) {
                            resolve(event);
                        };
                        worker.onerror = function (event) {
                            reject('error');
                        };
                    });
                };
                newWorker()
                    .then(function (data) {
                        self.finalyObject = data.data;
                        localStorage.setItem('data_years_'+self.identifier+'('+ self.setDatas[0] +'-'+ self.setDatas[1] +')', JSON.stringify({period:self.setDatas, total:data.data.total}));
                        self.buildCanvas();
                    }).then(function () {
                    togglePreloader(true);

                }).catch(function (err) {
                    console.error(err);
                });
            }
            else{
                self.finalyObject = JSON.parse(localStorage.getItem('data_years_' + this.identifier + '(' + self.setDatas[0] + '-' + self.setDatas[1] + ')'));
                this.buildCanvas();
            }
        } else{
            alert('Sorry , but you use to old shit! Try install some new browsers!!!');
        }

    }

    addData(index){
        //let years_period = [];
        let data = this['data_'+ index +''];
        localStorage.setItem('data_'+index+'', JSON.stringify(data));
    }

    buildCanvas() {

        console.log(this);
        console.log(this.finalyObject);


        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let count = 10;
        let index = 0;
        let self = this;
        let pi = Math.PI;
        let arr_a = [];
        let color_id = '#fff';
        let color_fnt = '#fff';

        if(canvas) {

            ctx.clearRect(0, 0, 670, 450);
            ctx.globalCompositeOperation = 'destination-over'

            if(self.setDatas[0] > self.setDatas[1]){
                ctx.fillStyle = "#f37070";
                ctx.strokeStyle = "#f37070";
                ctx.font = "normal 13pt Arial";
                ctx.fillText('Установлено не верное значение!', 0, 50);

            }
            else {

                if (this.identifier === 'temperature') {

                    for (let i = 10; i < 660; i++) {
                        buildLines([10, 200], [i, 200], '#2d525c', 2);
                    }

                    for (let key in self.finalyObject['total']) {

                        if (self.finalyObject['total'][key][0] > 0) {
                            color_id = '#f37070';
                            color_fnt = '#f37070';
                        } else {
                            color_id = '#2d525c';
                            color_fnt = '#2d525c';
                        }

                        buildLines([count, 200], [count, 200 - (self.finalyObject['total'][key][0] * 5)], color_id, 2);

                        ctx.lineWidth = 3;
                        ctx.strokeStyle = color_id;
                        ctx.fillStyle = color_id;
                        ctx.arc(count, 200 - (self.finalyObject['total'][key][0] * 5), 4, 0, 2 * pi, false);
                        ctx.stroke();
                        ctx.fill();
                        ctx.beginPath();

                        arr_a.push(self.finalyObject['total'][key][0]);
                        buildLines([count, 200 - (self.finalyObject['total'][key][0] * 5)], [count - 55, 200 - (arr_a[index - 1] * 5)], '#2d525c', 2);

                        ctx.fillStyle = color_fnt;
                        ctx.font = "normal 9pt Arial";
                        if (self.finalyObject['total'][key][0] > 0)
                            ctx.fillText('+' + self.finalyObject['total'][key][0], count - 10, 190 - (self.finalyObject['total'][key][0] * 5));
                        else
                            ctx.fillText(self.finalyObject['total'][key][0], count - 10, 220 - (self.finalyObject['total'][key][0] * 5));

                        ctx.fillStyle = "#2d525c";
                        ctx.strokeStyle = "#2d525c";

                        ctx.fillText(key.split('_')[1], count - 5, 300);

                        count += 55;
                        index++;
                    }


                } else {

                    setTimeout(function () {

                        for (let key in self.finalyObject['total']) {

                            for (let i = 10; i < 660; i++) {
                                buildLines([10, 350], [i, 350], '#f37070', 2);

                            }
                            ctx.fillStyle = "#f37070";
                            ctx.strokeStyle = "#f37070";
                            ctx.font = "normal 9pt Arial";
                            buildLines([count + 20, 350], [count + 20, 350 - (self.finalyObject['total'][key][0] * 80)], '#2d525c', 40);

                            ctx.fillText('+' + self.finalyObject['total'][key][0], count + 5, 340 - (self.finalyObject['total'][key][0] * 80));
                            ctx.fillStyle = "#2d525c";
                            ctx.strokeStyle = "#2d525c";
                            ctx.fillText(key.split('_')[1], count + 5, 370 - (self.finalyObject['total'][key][0]));
                            count += 55;
                            index++;
                        }
                    }, 0);
                }
            }
        }
        function buildLines (move, line, color, wh) {
            ctx.moveTo(move[0], move[1]);
            ctx.lineTo(line[0], line[1]);
            if(self.identifier === 'temperature'){
                ctx.lineWidth = wh;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.beginPath();
            }else{
                let gradient;
                gradient = ctx.createLinearGradient(0,0,0,350);
                gradient.addColorStop(0, "#f37070");
                gradient.addColorStop(1, "#2d525c");
                ctx.lineWidth = wh;
                ctx.strokeStyle = gradient;
                ctx.stroke();
                ctx.beginPath();

            }
        }
    }

    getData(e) {

        this.setState({ajaxLoad:true});
        let self = this;
        let xmlHttpRequest = function() {
            togglePreloader(false);
            return new Promise(function(resolve, reject) {
                let url = 'fromServer/'+ e +'.json';
                let xhr = new XMLHttpRequest();
                xhr.open('GET',url , true);
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (this.status >= 200 && this.status < 400) {
                            let data = JSON.parse(this.responseText);
                            resolve(data);
                        } else {
                            reject(new Error('Error'));
                        }
                    }
                }
                xhr.send();
            });
        };

        return xmlHttpRequest()
            .then(function(data){
                self['data_'+ e +''] = data;
                self.addData(e);
                self.setSelect(''+ MIN_LIM +'',''+ MAX_LIM +'');
                self.calcData(data);
                togglePreloader(true);
                self.setState({ajaxLoad:false});

            }).catch(function(err){
                console.error(err);
            });
    }




    render(){

        let maxLine;
        let minLine;
        let key;
        let self = this;

        window.onload = function(){


            self.props.updateData(self.state.pageLoaded);

            setTimeout(function(){

                self.props.loadDelay(self.state.delay);
            },1000)

            if(localStorage.getItem('data_temperature') || localStorage.getItem('data_precipitation')){

                let keys = ['temperature','precipitation'];
                //let identifier;
                for(let i = 0;i<keys.length;i++)
                    if(localStorage.getItem('data_'+keys[i]+'')){

                        self['data_'+keys[i]+''] = JSON.parse(localStorage.getItem('data_'+keys[i]+''));
                        self.identifier = keys[i];
                        key = keys[i];
                        document.querySelectorAll('.content__trigr-animate')[0].setAttribute('style','transform:translateX('+ (document.querySelectorAll('.btn-type')[i].getBoundingClientRect().left - document.querySelectorAll('.content__select-data')[0].getBoundingClientRect().left)+'px);')
                    }

                self.setSelect(MIN_LIM,MAX_LIM);
                self.calcData();

            } else{


                key = 'temperature';

                self.getData('temperature');

                self.identifier = 'temperature';

            }

            animationElements();

            togglePreloader(true);
        }

        if(!this.state.ajaxLoad){

            maxLine = buildSelect(buildArrSelect());
            minLine = buildSelect(buildArrSelect().reverse());

            return(
                <div className="content" id="content">
                    <div className="content__top-row row container">
                        <div className="content__select-data col-6">
                            <Btn name="temperature" onClick={this.calcData}  self={this}/>
                            <Btn name="precipitation" onClick={this.calcData}  self={this}/>
                            <span className="content__trigr-animate"></span>
                        </div>
                        <div className="content__period-box col-6 for-old-sht">
                            <select select-type="0" onChange={this.setSelect}  className="content__select" option-list="true">{maxLine}</select>
                            <select select-type="1"  onChange={this.setSelect}  className="content__select" option-list="false">{minLine}</select>
                            <span className="slide--period"></span>
                        </div>
                    </div>
                    <div className="content__middle-row row container">
                        <div className="content__canvas-box">
                            <div className="content__animate">
                                <svg width="50" height="50"><circle id="circle" r="22" cx="25" cy="25" fill="transparent" stroke="#f37070" strokeWidth="5" strokeLinecap="round"/></svg>
                            </div>
                            <div className="content__canvas-animate"></div>
                            <canvas id="canvas" height="450px" width="670px"></canvas>
                        </div>
                    </div>
                </div>
            );
        }else{

            return(
                <div className="content" id="content">
                    <div className="content__top-row row container">
                        <div className="content__select-data col-6">
                            <Btn name="temperature" classActive={key} onClick={this.calcData}  self={this}/>
                            <Btn name="precipitation" classActive={key} onClick={this.calcData}  self={this}/>
                            <span className="content__trigr-animate"></span>
                        </div>
                    </div>
                    <div className="content__middle-row row container">
                        <div className="content__canvas-box">
                        <div className="content__animate opacity-in">
                            <svg width="50" height="50"><circle id="circle" r="22" cx="25" cy="25" fill="transparent" stroke="#f37070" strokeWidth="5" strokeLinecap="round"/></svg>
                        </div>
                            <div className="content__canvas-animate"></div>
                            <canvas id="canvas" height="450px" width="670px"></canvas>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function animationElements(){

    let elm = document.querySelectorAll('.slide--period')[0];
    if(elm) {
        setInterval(function () {
            elm.classList.toggle('slide--hold');
        }, 5000)
    }
}

function buildArrSelect(){
    let arr = [];
    for(let i = MIN_LIM; i<=MAX_LIM;i++){
        arr.push(i);
    }
    return arr;
}

function togglePreloader(e){
    if(document.querySelectorAll('.content__animate')[0]){
        document.querySelectorAll('.content__canvas-animate')[0].classList.add('animation--vawe');
        document.querySelectorAll('.content__canvas-box')[0].classList.add('overflow');
        if(e) document.querySelectorAll('.content__animate')[0].classList.add('hide');
        else document.querySelectorAll('.content__animate')[0].classList.remove('hide');

        setTimeout(function(){
            document.querySelectorAll('.content__canvas-animate')[0].classList.remove('animation--vawe');
            document.querySelectorAll('.content__canvas-box')[0].classList.remove('overflow');
        },500)
    }
}

function buildSelect(arr) {
    return  arr.map((number) =>
        <option key={number.toString()} value={number}>{number}</option>
);
}

export default Canvas;
