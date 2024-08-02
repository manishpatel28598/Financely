import React from 'react'
import { Line, Pie } from '@ant-design/charts';


function ChartComponent({sortedTransactions}) {

    const data = sortedTransactions.map((item)=>{
        return {date: item.date, amount: item.amount};
    });
        const spendingData = sortedTransactions.filter((transaction)=>{
            if(transaction.type == "expense"){
                return {tag: transaction.tag, amount: transaction.amount};
            }
        });

    let finalSpendings = spendingData.reduce((acc, obj)=>{
        let key = obj.tag;
        if(!acc[key]){
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }
        else{
            acc[key].amount+=obj.amount;
        }
        return acc;
    },{});

      const config = {
        data: data,
        width:500,
        xField: 'date',
        yField: 'amount',
      };

      const Spendingconfig = {
        data: spendingData,
        width:500,
        agleField: 'amount',
        colorField: 'tag',
      };
      let chart;
      let PieCharts;
    return (
    <div className='charts-wrapper'>
        <div>
        <h2>Your Analytics</h2>
         <Line {...config}
         onReady={(charInstance)=>(chart = charInstance)} />
        </div>
        <div>
        <h2>Your Spendings</h2>
        <Pie {...Spendingconfig}
        onReady={(charInstance)=>{PieCharts = charInstance}} />
        </div>
    </div>
  )
}

export default ChartComponent
