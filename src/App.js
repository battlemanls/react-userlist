import React, { Component } from 'react';
import './App.css';
import Radar from './components/Radar';
import Modal from 'react-modal';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            users: [],
            copyusers: [],
            error: null,
            modalIsOpen: false
        }
        this.actualUser = undefined
        this.actualButton = undefined
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonText = this.buttonText.bind(this)
        this.getUser();

    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    getUser(){ // Считывание данных
        fetch('https://randomuser.me/api/?results=20')
            .then(response => response.json())
            .then(data =>
                this.setState({
                    users: data,
                    isLoading: false,
                    copyusers: data
                })
            )
            .catch(error => this.setState({ error, isLoading: false }));
    }

    componentDidMount(){ // Обновление данных
        this.getUser()
    }

    buttonText(event){ // отобразить больше информации о пользователе
        var block =  document.getElementsByClassName('blockInfo')[Math.ceil(event.currentTarget.rowIndex/2)-1]
        var buttonU = document.getElementsByClassName('bIndicator')[Math.ceil(event.currentTarget.rowIndex/2)-1]
        if (block == this.actualUser){
            block.style.display=""
            this.actualUser=undefined
            this.actualButton=undefined
            buttonU.innerHTML="+"

        }
        else if(this.actualUser!=undefined){
            this.actualUser.style.display=""
            this.actualButton.innerHTML="+"
            block.style.display="table-row"
            buttonU.innerHTML="-"
            this.actualUser=block
            this.actualButton = buttonU
        }
        else{
            block.style.display="table-row"
            this.actualUser=block
            this.actualButton=buttonU
            buttonU.innerHTML="-"
        }
    }

    renderInfo(data){  // рендер таблицы с информацией о пользовтеле
        var bDate = new Date((data.dob.date))
        var rDate = new Date((data.registered.date))
        return  <tr className="blockInfo"><td colSpan={7}>
            <div>
                <table className="tableInfo"><tbody><tr>
                    <td className="td-1" colSpan={4}> {data.name.last}</td>
                </tr>
                    <tr>
                        <td className="td-2"><span>Username: </span>{data.login.username}</td>
                        <td className="td-2"><span>Address: </span>{data.location.street}</td>
                        <td className="td-2"><span>Birthday: </span>{bDate.getDay()}/{bDate.getMonth()}/{bDate.getFullYear()}</td>
                        <td rowSpan={4}><img src={data.picture.large}></img></td>
                    </tr>
                    <tr>
                        <td className="td-2"><span>Registered: </span>{rDate.getDay()}/{rDate.getMonth()}/{rDate.getFullYear()}</td>
                        <td className="td-2"><span>City: </span>{data.location.city}</td>
                        <td className="td-2"><span>Phone: </span>{data.phone}</td>
                    </tr>
                    <tr>
                        <td className="td-2"><span>Email: </span> {data.email}</td>
                        <td className="td-2"><span>Zip: </span>{data.location.postcode}</td>
                        <td className="td-2"><span>Cell: </span>{data.cell}</td>
                    </tr>
                    <tr>
                        <td className="td-4" colSpan={3}>&nbsp;</td>
                    </tr>
                </tbody></table>
            </div></td>
        </tr>
    }

    renderRow = data =>{ // рендер строк основнйо таблицы
        var row = <tr className="blockList" onClick={this.buttonText}>
            <td><img src={data.picture.medium}></img></td>
            <td>{data.name.last}</td>
            <td>{data.name.first}</td>
            <td>{data.login.username}</td>
            <td>{data.phone}</td>
            <td>{data.location.city} {data.location.street}</td>
            <td><button className="bIndicator">+</button></td>
        </tr>
        return row
    }

    renderTable(){ // рендер основной таблицы
        if(this.state.isLoading==false) {
            var rows = []
            rows.push(<tr>
                <th></th>
                <th>Last</th>
                <th>First</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Location</th>
            </tr>)
            for (var i = 0; i < this.state.users['results'].length; i++) {
                rows.push(this.renderRow(this.state.users['results'][i]))
                rows.push(this.renderInfo(this.state.users['results'][i]))

            }
            return <table className="listUser"><tbody>{rows}</tbody></table>
        }
    }

    loadi(){ // Вставить оригинальный лист пользователей
              this.state.users=this.state.copyusers
    }

    searchUser(positionSearch){ // поиск совпадений имен
        this.arrayUser = {results:[]}
        for (var i = 0; i < this.state.users['results'].length; i++) {
            for(var j = 0; j<positionSearch.length; j++){
                if(positionSearch[j]==i){
                    this.arrayUser["results"].push(this.state.users['results'][i])
                }
            }
        }
        this.setState({users:this.arrayUser})
}

    handleSubmit(e) { // обработка нажатия на кнопку поиска
        this.loadi()
        var positionSearch = []
        var pattern = new RegExp(this.input.value,"g");
        for (var i = 0; i < this.state.users['results'].length; i++) {
            var res = this.state.users['results'][i].name.first
            if(res.match(pattern)){
                positionSearch.push(i)
            }
        }
        e.preventDefault();
        this.searchUser(positionSearch)
    }

    formSearch(){ // форма поиска
        return <form onSubmit={this.handleSubmit}>
            <table><tbody>
                <tr>
                    <td>Search (First name): <input type="text" ref={(input) => this.input = input} />  <input type="submit" value="search" /></td>
                </tr>
            </tbody>
            </table>
        </form>
    }


    renderHeadNModal(){ // отобрадение таблицы с модальным окном и поиском
        return <table className="tHead"><tbody>
            <tr>
                <td>{this.formSearch()}</td>
                <td><button onClick={this.openModal}>Show chart</button></td>
            </tr>
            <tr>
                <td colSpan={2}><Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="Modal"
                    contentLabel="Example Modal" >
                    <h3>Gender users</h3>
                    <div className="bClose"><button onClick={this.closeModal}>close</button></div>
                    {< Radar data={this.state}/>}
                </Modal></td>

            </tr>
        </tbody>
        </table>
    }

    render() {
        return (
            <div className="App">
                {this.renderHeadNModal()}
                {this.renderTable()}
            </div>
        )
    }
}

export default App;
