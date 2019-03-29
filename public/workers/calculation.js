

onmessage = function(args){

	let self = args[3];
	let identifier = args['data'][0];
	let keys = args['data'][1];
	let data = args['data'][2];
	let resultArr = [];
	let calculation = {};
	let months = ['январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'август',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь'];
	let index;
	let num;
	let count;
	let dataAll;
	if(typeof data === 'string')
		dataAll = JSON.parse(data);
	else
		dataAll = data;

	for(let i = 0; i<dataAll.length;i++){
		if(dataAll[i]['t'].split('-')[0] >= parseInt(keys[0]) && dataAll[i]['t'].split('-')[0] <= parseInt(keys[1])){
			resultArr.push(dataAll[i]);
		}
	}

	for(index = 1; index < 13; index++){
		num = 0;
		count = 0;
		for(let i = 0; i<resultArr.length;i++){

			if(parseInt(resultArr[i]['t'].split('-')[1]) == index){
				count ++;
				num  += parseInt(resultArr[i]['v']);
			}
		}
		if(identifier == 'precipitation'){
			calculation[index + '_' + months[index - 1]] = [(num / count).toFixed(2), 'mean of ' + count + ' days'];
		}
		else
		{
			calculation[index + '_' + months[index - 1]] = [Math.round(num / count), 'mean of ' + count + ' days'];
		}
	}
	postMessage({period:keys,total:calculation});
}

