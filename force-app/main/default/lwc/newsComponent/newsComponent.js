import { LightningElement, track } from 'lwc';
import retrieveNews from "@salesforce/apex/newsController.retrieveNews";

export default class NewsComponent extends LightningElement {
    @track result = []
    @track selectedNews={};
    @track isModalOpen = false;
    get modalClass(){
        return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" :""}`
    }
    get modalBackdropClass(){
        return this.isModalOpen ? "slds-backdrop slds-backdrop_open" :"slds-backdrop"
    }

    connectedCallback(){
        this.fetchNews();
    }
    fetchNews(){
        retrieveNews().then(response=>{
            console.log(response);
            this.formatNewsData(response.articles);
        }).catch(error=>{
            console.error(error);
        })
    }
    formatNewsData(res) {
        this.result = res.map((item, index)=>{
            let id = `new_${index+1}`;
            const options = { weekday: 'short', month: 'long', year: 'numeric', day: 'numeric' };
            let date = new Date(item.publishedAt).toLocaleDateString('fr-FR', options);
            let name = item.source.name;
            return {...item, id:id, name:name, date:date.charAt(0).toUpperCase() + date.slice(1)}
        })

    }
    showModal(event) {
        let id = event.target.dataset.item;
        this.result.forEach(item=>{
            if(item.id === id){
                this.selectedNews ={...item}
            }
        })
        this.isModalOpen = true;
    }
    closeModal(){
        this.isModalOpen = false;
    }
}