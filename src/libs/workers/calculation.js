onmessage = function(args){

	let a = args;

	// var identifier = args['data'][0];
	// var keys = args['data'][1];
	// var data = args['data'][2];
	// var dataAll;
	// var resultArr = [];
	// var calculation = {};
	// var months = ['январь',
	// 			  'февраль',
	// 			  'март',
	// 			  'апрель',
	// 			  'май',
	// 			  'июнь',
	// 			  'июль',
	// 			  'август',
	// 			  'сентябрь',
	// 			  'октябрь',
	// 			  'ноябрь',
	// 			  'декабрь'];
	// var index;
	// var num;
	// var count;
	// if(typeof data == 'string')
	// 	var dataAll = JSON.parse(data);
	// else
	// 	var dataAll = data;
	//
	// for(let i = 0; i<dataAll.length;i++){
	// 	if(dataAll[i]['t'].split('-')[0] >= parseInt(keys[0]) && dataAll[i]['t'].split('-')[0] <= parseInt(keys[1])){
	// 		resultArr.push(dataAll[i]);
	// 	}
	// }
	//
	// for(index = 1; index < 13; index++){
	// 	num = 0;
	// 	count = 0;
	// 	for(let i = 0; i<resultArr.length;i++){
	//
	// 		if(parseInt(resultArr[i]['t'].split('-')[1]) == index){
	// 			count ++;
	// 			num  += parseInt(resultArr[i]['v']);
	// 		}
	// 	}
	// 	if(identifier == 'precipitation')
	// 		//total.push([(num/count).toFixed(2),count]);
	// 		calculation[index+'_'+months[index-1]] = [(num/count).toFixed(2),'mean of '+count+' days'];
	// 	else
	// 		//total.push([Math.round(num/count),count]);
	// 		calculation[index+'_'+months[index-1]] = [Math.round(num/count),'mean of '+count+' days'];
	// }

	//console.log(returnData);
	//window.localStorage.setItem('data_years_'+rainClass.identifier+'('+keys[0]+'-'+keys[1]+')', JSON.stringify({period:keys, total:calculation}));
	//postMessage({period:keys, total:calculation});

	postMessage(a);

	

}

