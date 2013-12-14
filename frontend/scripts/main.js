//console.log shorthand
var cl = function(text) {
	console.log(text);
}

var currentBlock = null;
var currentParent = null;

function init() {
	var queryEditor = document.getElementById("queryEditor");
	var baseNode = document.createElement('div');
	queryEditor.appendChild(baseNode);

	currentParent = queryEditor;
	currentBlock = queryEditor.children[0];

	var selectButton = document.getElementById("selectButton");
	var projectButton = document.getElementById("projectButton");
	var unionButton = document.getElementById("unionButton");
	var intersectButton = document.getElementById("intersectButton");
	var crossButton = document.getElementById("crossButton");
	var subtractButton = document.getElementById("subtractButton");
	var joinButton = document.getElementById("joinButton");
	var thetaJoinButton = document.getElementById("thetaJoinButton");
	var fullOuterJoinButton = document.getElementById("fullOuterJoinButton");
	var thetaOuterJoinButton = document.getElementById("thetaOuterJoinButton");
	var rightOuterJoinButton = document.getElementById("rightOuterJoinButton");
	var thetaRightOuterJoinButton = document.getElementById("thetaRightOuterJoinButton");
	var leftOuterJoinButton = document.getElementById("leftOuterJoinButton");
	var thetaLeftOuterJoinButton = document.getElementById("thetaLeftOuterJoinButton");

	selectButton.onclick = function(){addOperatorConditionRelation("σ", selectToSQL)};
	projectButton.onclick = function(){addOperatorConditionRelation("π", projectToSQL, "columnNames")};
	unionButton.onclick = function(){addRelationOperatorRelation("∪", unionToSQL)};
	intersectButton.onclick = function(){addRelationOperatorRelation("∩", intersectToSQL)};
	crossButton.onclick = function(){addRelationOperatorRelation("×", crossToSQL)};
	subtractButton.onclick = function(){addRelationOperatorRelation("−", subtractToSQL)};
	joinButton.onclick = function(){addRelationOperatorRelation("⋈", joinToSQL)};
	thetaJoinButton.onclick = function(){addRelationOperatorConditionRelation("⋈", thetaJoinToSQL)};
	fullOuterJoinButton.onclick = function(){addRelationOperatorRelation("⟗", fullOuterJoinToSQL)};
	thetaOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("⟗", thetaOuterJoinToSQL)};
	rightOuterJoinButton.onclick = function(){addRelationOperatorRelation("⟕", rightOuterJoinToSQL)};
	thetaRightOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("⟕", thetaRightOuterJoinToSQL)};
	leftOuterJoinButton.onclick = function(){addRelationOperatorRelation("⟕", leftOuterJoinToSQL)};
	thetaLeftOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("⟕", thetaLeftOuterJoinToSQL)};

	// setOutput(queryEditor.children[0].toSQL());

	queryEditor.onclick = function() {
		if(currentBlock != null) {
			currentBlock.deselect();		
			currentBlock = null;	
		}
		if(document.getElementById("textEditor").style.display == "block") {
			document.getElementById("textEditor").style.display="none";
		}
	}
	window.onresize = function() {
		document.getElementById("queryEditor").style.width = "" + 
			(window.innerWidth-260)+"px";
		document.getElementById("console").style.width = "" + 
			(window.innerWidth-45)+"px";
		document.getElementById("menu").style.width = "" + 
			(window.innerWidth-45)+"px";
	}
	window.onresize();
}
function SQLConvert() {
	var queryEditor = document.getElementById("queryEditor");
	var sqlText = queryEditor.children[0].toSQL();
	return sqlText.substring(1,sqlText.length-1);
}
function setOutput(text) {
	document.getElementById("console").textContent = text;
}
function displayTextEditor(x, y, text, textDiv) {
	var textEditor = document.getElementById("textEditor");
	var textEditorTextArea = document.getElementById("textEditorTextArea");
	var textEditorDone = document.getElementById("textEditorDone");
	textEditor.style.display = "block";
	textEditor.style.top = "" + y + "px";
	textEditor.style.left = "" + x + "px";
	textEditorTextArea.value = text;
	textEditor.textDiv = textDiv;
	textEditorDone.onclick = function() {
		var textEditor = document.getElementById("textEditor");
		var textEditorTextArea = document.getElementById("textEditorTextArea");
		textEditor.textDiv.textContent = textEditorTextArea.value;
		textEditor.style.display = "none";
	}
}
function loadRelationalAlgebraJSON() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "relationalAlgebra.json", true);
	xhr.send();
	xhr.onreadystatechange = function(){
		if (this.readyState == 4) {
		    if (this.status == 200){
		    	var relationalAlgebra = JSON.parse(this.responseText);
		    	cl(relationalAlgebra["test"]);
		    }
		    else {
		        console.log("XMLHttpRequest error: " + xhr.status); 
		      } 
		    } 
	};
}



function createOperator(text) {
	var operator = document.createElement('div');
	operator.innerHTML = text;
	operator.className = "queryEditorOperator";

	operator.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		currentBlock = this.theParent;
		currentParent = this.theParent.theParent;
		this.theParent.leftParenthesis.className = "queryEditorParenthesisSelected";
		this.theParent.rightParenthesis.className = "queryEditorParenthesisSelected";
		this.theParent.leftParenthesis.innerHTML = "[";
		this.theParent.rightParenthesis.innerHTML = "]";
		
		e.cancelBubble = true;
	}
	return operator;
}

function createRelation(text) {
	var relation = document.createElement('div');
	relation.isLeaf = true;
	relation.className = "queryEditorRelation";
	var relationText = document.createElement('div');
	relationText.innerHTML = text;
	relationText.className = "queryEditorRelationText";

	relation.leafText = relationText;
	relation.leftParenthesis = createParenthesis(relation, "left");
	relation.rightParenthesis = createParenthesis(relation, "right");

	relation.appendChild(relation.leftParenthesis);
	relation.appendChild(relation.leafText);
	relation.appendChild(relation.rightParenthesis);
	relation.toSQL = function() {
		return this.leafText.textContent;
	}

	relation.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		displayTextEditor(e.pageX, e.pageY, this.leafText.textContent, relationText)
		currentBlock = this;
		currentParent = this.theParent;

		e.cancelBubble = true;
	}
	relation.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	return relation;
}

function createCondition(text) {
	var condition = document.createElement('div');
	condition.innerHTML = text;
	condition.className = "queryEditorCondition";
	condition.isLeaf = true;

	condition.toSQL = function() {
		return this.textContent;
	}

	condition.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		displayTextEditor(e.pageX, e.pageY, this.textContent, this)

		e.cancelBubble = true;
	}
	condition.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}

	return condition;
}

function createParenthesis(child, orientation) {
	var parenthesis = document.createElement('div');
	parenthesis.className = "queryEditorParenthesis";
	
	if(orientation == "left") {
		parenthesis.innerHTML = "(";
	} 
	else if(orientation == "right") {
		parenthesis.innerHTML = ")";
	}
	else {
		return null
	}
	parenthesis.child = child;

	parenthesis.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		currentBlock = this.child;
		currentParent = this.child.theParent;
		this.child.leftParenthesis.className = "queryEditorParenthesisSelected";
		this.child.rightParenthesis.className = "queryEditorParenthesisSelected";
		this.child.leftParenthesis.innerHTML = "[";
		this.child.rightParenthesis.innerHTML = "]";
		
		e.cancelBubble = true;
	}
	return parenthesis;
}
function addOperatorConditionRelation(operator, toSQL, conditionName) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator);
	if(conditionName != undefined) {
		expression.condition = createCondition(conditionName);
	}
	else {
		expression.condition = createCondition("condition");
	}
	expression.relation = createRelation("Relation");
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.condition);
	expression.appendChild(expression.relation);
	expression.appendChild(expression.rightParenthesis);

	expression.relation.theParent = expression;
	expression.condition.theParent = expression;
	expression.operator.theParent = expression;

	expression.theParent = currentParent;

	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}
function addRelationOperatorRelation(operator, toSQL) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator);
	expression.relation1 = createRelation("Relation1");
	expression.relation2 = createRelation("Relation2");
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.relation1);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.relation2);
	expression.appendChild(expression.rightParenthesis);

	expression.relation1.theParent = expression;
	expression.relation2.theParent = expression;
	expression.operator.theParent = expression;

	expression.theParent = currentParent;
	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}
function addRelationOperatorConditionRelation(operator, toSQL) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator);
	expression.relation1 = createRelation("Relation1");
	expression.relation2 = createRelation("Relation2");
	expression.condition = createCondition("condition");
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.relation1);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.condition);
	expression.appendChild(expression.relation2);
	expression.appendChild(expression.rightParenthesis);

	expression.relation1.theParent = expression;
	expression.relation2.theParent = expression;
	expression.operator.theParent = expression;
	expression.condition.theParent = expression;

	expression.theParent = currentParent;
	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}

function selectToSQL() {
	return "(SELECT * FROM " + this.children[3].toSQL() + " WHERE " + 
		this.children[2].toSQL()+")";
}
function projectToSQL() {
	return "(SELECT DISTINCT " + this.children[2].toSQL() + " FROM " + 
		this.children[3].toSQL()+")";
}
function unionToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " UNION SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function intersectToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " INTERSECT SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function crossToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " JOIN " + 
		this.children[3].toSQL()+")";
}
function subtractToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " EXCEPT SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function joinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function fullOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL OUTER JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " OUTER JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function rightOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL RIGHT JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaRightOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " RIGHT JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function leftOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL LEFT JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaLeftOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " LEFT JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}