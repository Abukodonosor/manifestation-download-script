
import axios from 'axios'
import * as fs from 'fs';
import { Set } from 'typescript';


const axiosInstance = axios.create({});

interface Manifestation {
    origin:string
}

const EventContext: Manifestation = {
    origin: 'https://www.serbia.travel/kalendar'
};


(async()=>{
    // script need to scrape data

    const AllManifestationArray: Map<string,any> = new Map();
    let numberOfItems: Number = 0;

    const NUMBER_OF_MONTH = 13
    for(let month=0; month < NUMBER_OF_MONTH; month++){
        const eventList:any = await getManifestationData(month);
        eventList.data.items.forEach((eventItem:any) => {
            AllManifestationArray.set(eventItem.title, eventItem)
        });

        numberOfItems += eventList.data.items.length
    }
    
    // map data to extended structure 
    console.log(AllManifestationArray)

    // write file to use the parsed data
    fs.writeFileSync('manifestations.json',JSON.stringify({
        manifestations: AllManifestationArray
    },replacer))

    console.log("Items collected: ",numberOfItems)
    console.log("Execute")

})()



function getManifestationData(month:any){
    return new Promise((resolve,reject)=>{
        const options = {
            method: 'POST',
            url: EventContext.origin,
            // params: { category: 'all', count: '2'},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Encoding': "gzip, deflate, br",
                'Origin': 'https://www.serbia.travel'
            },
            data: {
                json: 1,
                perpage: 30,
                datestart: null,
                dateend: null,
                month: month,
                // city: "Сви градови",
                // category: "Све"
            }
        };
        axiosInstance.request({
            ...options
        }).then(result=>{
            resolve(result)
        }).catch(error=>{
            reject(error)
        })
    })
}

function replacer(key:any, value:any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }