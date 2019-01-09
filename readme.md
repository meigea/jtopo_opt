# 具备功能
- 1, 创建伴生`topo`节点
- 2, 创建DIV覆盖
- 3, 兼容和管理DIV对应节点的适应
- 4, 伴生鼠标事件的DIV弹出


# 注意内容上主要涵盖了

```
  td{
   cursor: pointer;
  }
  body{
   cursor: pointer !important;
  }
  #canvas{
	cursor: pointer !important;
  }
  .ftx{
	/* display: none; */
	z-index: 300;
	position: absolute;
  }
  .flow{
	width:121px;
	margin-left: 50px;
	/* border: 1px solid #33CCFF; */
  }
  .flow .flow-head{
	/* border-bottom: 1px solid #33CCFF; */
  }
  .flow .no-padding{
	padding-right: 0px !important;
	padding-left: 0px !important;
  }
  .flow .red{
	color:#dd4b39;
  }
  .flow .green{
	color:#00a65a;
  }
  .flow p{
	font-size: 8px;
	margin-bottom: 0px;
  }
  .flow .flow-text{
	float:right;
	padding-right: 13px;
  }
  .flow .flow-arrow{
	padding-left: 3px;
  }
  .flow .border-right{
	/* border-right: 1px solid #33CCFF; */
  }

  /*   2019-01-08  */
  .flow1{
	width: 40px;
	margin-left: 50px;
  }
  .flow2{
	width: 60px !important;
  }
  .flow1 .red{
	color:#dd4b39;
  }
  .flow1 .green{
	color:#00a65a;
  }
  .flow1 p{
	font-size: 12px;
	margin-bottom: 0px;
  }
  .flow1 .flow-text{
	float:right;
	padding-right: 13px;
  }
  .flow1 .flow-text1{
	float:left;
	padding-left: 3px;
  }
  .flow1 .flow-arrow{
	padding-left: 3px;
  }
```

# 备份