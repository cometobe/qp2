//（1）引入ejsExcel和fs模块

let ejsExcel=require('ejsexcel');
let fs=require('fs');

//（2）使用fs将excel文件读取到buffer中
export const read = (file) =>{
    console.log("导入的excel",file)
let exBuf=fs.readFileSync(file);
//（3）使用ejsExcel的getExcelArr将buffer读取为数组

//<1>使用getExcelArr函数读取buffer后，得到的是excel工作表文件

    // let workBook=exlJson;
//<2>拿到工作表里面的第一个工作簿

    // let workSheets=workBook[0];

//<3>有了工作簿之后，就可以读取里面每行数据了。

// workSheets.forEach((item,index)=>{
//         console.log((index+1)+" row:"+item.join('    '));
// })

ejsExcel.getExcelArr(exBuf).then(exlJson=>{
    console.log("************  read success:getExcelArr");
    let workBook=exlJson;
    let workSheets=workBook[0];
    workSheets.forEach((item,index)=>{
            console.log((index+1)+" row:"+item.join('    '));
            console.log(item[index])
    })
}).catch(error=>{
    console.log("************** had error!");
    console.log(error);
});

}




export default {
    read
  }