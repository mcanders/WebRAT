//console.log shorthand
var cl = function(text) {
	console.log(text);
}

var currentBlock = null;
var currentParent = null;
var queryEditor = null;

function init() {
	queryEditor = document.getElementById("queryEditor");
	var baseNode = document.createElement('div');
	queryEditor.appendChild(baseNode);

	currentParent = queryEditor;
	currentBlock = queryEditor.children[0];

	// addProject();

	// setOutput(queryEditor.children[0].toSQL());

	queryEditor.onclick = function() {
		if(currentBlock != null) {
			currentBlock.deselect();		
			currentBlock = null;	
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

function setOutput(text) {
	document.getElementById("console").textContent = text;
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
	relation.innerHTML = text;
	relation.className = "queryEditorRelation";
	relation.isLeaf = true;

	relation.toSQL = function() {
		return this.innerHTML;
	}

	relation.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}

		currentBlock = this;
		currentParent = this.theParent;

		e.cancelBubble = true;
	}
	relation.deselect = function() {
		
	}
	return relation;
}

function createCondition(text) {
	var condition = document.createElement('div');
	condition.innerHTML = text;
	condition.className = "queryEditorCondition";
	condition.isLeaf = true;

	condition.toSQL = function() {
		return this.innerHTML;
	}

	condition.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		e.cancelBubble = true;
	}
	condition.deselect = function() {

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

function addSelect() {
	var select = document.createElement('div');
	select.className = "queryEditorExpression";
	select.operator = createOperator("σ");
	select.condition = createCondition("condition");
	select.relation = createRelation("Relation");
	select.leftParenthesis = createParenthesis(select, "left");
	select.rightParenthesis = createParenthesis(select, "right");

	select.appendChild(select.leftParenthesis);
	select.appendChild(select.operator);
	select.appendChild(select.condition);
	select.appendChild(select.relation);
	select.appendChild(select.rightParenthesis);

	select.relation.theParent = select;
	select.condition.theParent = select;
	select.operator.theParent = select;

	select.theParent = currentParent;

	select.toSQL = function() {
		return "(SELECT * FROM " + this.children[3].toSQL() + " WHERE " + 
			this.children[2].toSQL()+")";
	}

	select.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(select, currentBlock);

	currentBlock = null;
	currentParent = null;
}

function addProject() {
	var project = document.createElement('div');
	project.className = "queryEditorExpression";
	project.operator = createOperator("π");
	project.condition = createCondition("columnNames");
	project.relation = createRelation("Relation");
	project.leftParenthesis = createParenthesis(project, "left");
	project.rightParenthesis = createParenthesis(project, "right");

	project.appendChild(project.leftParenthesis);
	project.appendChild(project.operator);
	project.appendChild(project.condition);
	project.appendChild(project.relation);
	project.appendChild(project.rightParenthesis);

	project.relation.theParent = project;
	project.condition.theParent = project;
	project.operator.theParent = project;

	project.theParent = currentParent;

	project.toSQL = function() {
		return "(SELECT DISTINCT " + this.children[2].toSQL() + " FROM " + 
			this.children[3].toSQL()+")";
	}

	project.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(project, currentBlock);

	currentBlock = null;
	currentParent = null;
}