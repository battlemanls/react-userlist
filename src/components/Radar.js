import React, { Component } from 'react';
import { Chart } from "react-google-charts";


class Radar extends Component { // Отображение графика
    constructor(props) {
        super(props);
        this.renderRadar = this.renderRadar.bind(this)
    }

    radarData(){ // подсчет данных
        var male = 0
        var female = 0
        for (var i = 0; i < this.props.data.users['results'].length; i++) {
            if (this.props.data.users['results'][i].gender == "male") {
                male += 1
            }
            else {
                female += 1
            }
        }
        return [male, female]

    }

    renderRadar(){ // отображение графика
        if(this.props.data.isLoading==false) {
            var maleFemale = this.radarData()
            var male = maleFemale[0]
            var female = maleFemale[1]
            return <Chart
                chartType="PieChart"
                data={[['Task', 'Hours per Day'],
                    ['Male', male],
                    ['Famele', female]]}
                width="100%"
                height="400px"
                legendToggle
            />
        }
    }

    render(){
        return(
            <div>
            {this.renderRadar()}
            </div>

        )
    }

}
export default Radar;