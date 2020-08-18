
var quizController = (function(){

	function Question(id, questionText, options, correctAnswer){
		this.id = id;
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
	}

	var questionLocalStorage = {
		setQuestionCollection: function(newCollection){
			localStorage.setItem('questionCollection', JSON.stringify(newCollection));
		},
		getQuestionCollection: function(){
			return JSON.parse(localStorage.getItem('questionCollection'));
		},
		removeQuestionCollection: function(){
			localStorage.removeItem('questionCollection');
		}
	};


			if(questionLocalStorage.getQuestionCollection() === null){
				questionLocalStorage.setQuestionCollection([]);
				
			}

	return{

		getQuestionLocalStorage: questionLocalStorage,
		addQuestionOnLocalStorage: function(newQuestionText, opts){
			var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

			if(questionLocalStorage.getQuestionCollection() === null){
				questionLocalStorage.setQuestionCollection([]);
				
			}

			optionsArr = [];

			isChecked = false;

	

			for(var i = 0; i < opts.length; i++){
				if(opts[i].value !== ""){
					optionsArr.push(opts[i].value);
				}

				if(opts[i].previousElementSibling.checked && opts[i].value !== ""){
					corrAns = opts[i].value;
					isChecked = true;
				}
			}

			//[ {id: 0} {id: 1}]

			if(questionLocalStorage.getQuestionCollection().length > 0){
				questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id +1;

			}else{
				questionId = 0;
			}

			if(newQuestionText.value !==""){
				if(optionsArr.length > 1){
					if(isChecked){

						newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

						// console.log(newQuestion);
						getStoredQuests = questionLocalStorage.getQuestionCollection();

						getStoredQuests.push(newQuestion);
						
						questionLocalStorage.setQuestionCollection(getStoredQuests);

						newQuestionText.value="";
						for(var x = 0; x < opts.length; x++){
							opts[x].value = ""
							opts[x].previousElementSibling.checked = false;
						}
						console.log(questionLocalStorage.getQuestionCollection());
						return true;
					}else{
						alert('You missed to check correct answer, or you checked answer without value');
						return false;
					}
				}else{
					alert('You must insert at least two options');
					return false;
				}

			}else{
				alert('Please, Insert question.');
				return false;
			}	
		}
	};

})();


var UIController = (function(){

	var domItems = {
		questionInsertBtn: document.getElementById("question-insert-btn"),
		newQuestionText: document.getElementById("new-question-text"),
		adminOptions: document.querySelectorAll(".admin-option"),
		adminOptionsContainer: document.querySelector(".admin-options-container"),
		insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper")

	};
	return {
		getDomItems: domItems,

		addInputsDynamically: function(){

			var addInput = function(){
				
				var inputHTML, z;
				z = document.querySelectorAll('.admin-option').length;

			
				console.log(z);

				inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+z+'" name="answer" value="'+z+'"><input type="text" class="admin-option admin-option-'+z+'" value=""></div>';

				domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);


				domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
				domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

			}

			domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
		},


		createQuestionList: function(getQuestions){

			var questHTML, numberingArr;

			numberingArr = [];

			domItems.insertedQuestsWrapper.innerHTML = "";

			for(var i = 0; i < getQuestions.getQuestionCollection().length; i++){

				numberingArr.push(i+1);
				questHTML = '<p><span> ' + numberingArr[i] +'. ' + getQuestions.getQuestionCollection()[i].questionText +  '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

				console.log(getQuestions.getQuestionCollection()[i].id);
				domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);  
			}

		}
	};

})();

var controller = (function(quizCtrl, UICtrl){

	var selectedDomItems = UICtrl.getDomItems;

	UICtrl.addInputsDynamically();

	UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

	selectedDomItems.questionInsertBtn.addEventListener('click', function(){
		var adminOptions = document.querySelectorAll('.admin-option');
		var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
		if(checkBoolean){
			UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
		}
	});

})(quizController, UIController);