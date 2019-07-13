# pfnt
> 我自己的笔记软件，数据用noteDB,框架为electron-vue打包。

2018-10-07
修改了文章预览界面卡片的CSS，删除最大高度限制。


2018-11-20
修改文件增加了日期的格式化处理，减少了1天日期的减少问题
E:\QUSHAOJUN\pro\node\pfnt\src\renderer\components\todo\Item.vue
```
this.item.plandate = moment(this.item.plandate).format('YYYY-MM-DD')//对datepicker输出的utc日期格式为日期字符串
this.item.finishdate = moment(this.item.finishdate).format('YYYY-MM-DD')//对datepicker输出的utc日期格式为日期字符串
```

#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[80dc2ec](https://github.com/SimulatedGREG/electron-vue/tree/80dc2ece3425c558bfb2efbd57c3071e1b71be6d) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
