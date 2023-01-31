
import axios from 'axios'
import * as fs from 'fs';


const axiosInstance = axios.create({});

interface Manifestation {
    base: string
    origin:string
    headers: Record<string,string>
    body: Object,
    transformationLayer: Record<string,Object>
}

/**
 * Configuration file for data collecting
 */
const EventContext: Manifestation = {
    base: 'https://www.serbia.travel/',
    origin: 'https://www.serbia.travel/kalendar',
    headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Encoding': "gzip, deflate, br",
        'Accept-Language': 'en,en-GB;q=0.9,en-US;q=0.8,sr;q=0.7,bs;q=0.6,hr;q=0.5',
        'Origin': 'https://www.serbia.travel',
        'Referer': 'https://www.serbia.travel/kalendar',
        'Cookie': 'alreadyvisited=1'
    },
    /**
     * Fake API data
     */
    body: {
        json: 1,
        perpage: 30,
        datestart: "",
        dateend: "",
        month: "",
        city: "Сви градови",
        category: "Све"
    },
    transformationLayer: {
        'TO-DATA-SET-1': {
            category: '',
            photo: `https://www.serbia.travel`,
            eventDate: '',
            realEventDate:{
                from: '',
                to: '',
            },
            title: '',
            intro: '',
            intro2: '',
            place: 'Панчево',
            contact: '',
            introExpanded: '',
            // custom keys
            map: {
                cordX: '',
                cordY: ''
            },
            englishCategory: '',
            time: '',
        }
    }
};

(async()=>{
    // script need to scrape data
    console.log(`***Sending requests to collect the data from: ${EventContext.origin}`)
    const AllManifestationArray: Map<string,any> = new Map();
    let numberOfItemsAccumulator: Number = 0;

    const NUMBER_OF_MONTH = 1
    /**
     * Collect the data from specific API by sending requests for different months
     * we use one un-existing number to brake the server *()
     */
    for(let month=0; month < NUMBER_OF_MONTH; month++){
        const eventList:any = await getManifestationData(month);
        console.log(`***consuming for month: ${month}`)
        eventList.data.items.forEach((eventItem:any) => {
            // custom 
            const newItem = transformer({
                photo: EventContext.base + eventItem.photo
            },EventContext.transformationLayer['TO-DATA-SET-1'], eventItem)

            // add value to the specific dataset
            AllManifestationArray.set(eventItem.title, newItem)
        });

        numberOfItemsAccumulator += eventList.data.items.length
    }
    
    // map data to extended structure 
    console.log(AllManifestationArray)

    // write file to use the parsed data
    fs.writeFileSync('manifestations.json',JSON.stringify({
        manifestations: AllManifestationArray
    }, replacer))

    console.log("Items collected: ",numberOfItemsAccumulator)
    console.log("Executed")

})()

function getManifestationData(month:any){
    return new Promise((resolve,reject)=>{
        const options = {
            method: 'POST',
            url: EventContext.origin,
            headers: EventContext.headers,
            data: EventContext.body
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

/**
 * 
 * @param templateObject - object which contain key of structure
 * @param actualData - actual data keys
 * @returns 
 */
function transformer(patch:any, templateObject:any, actualData:any){
    return {
        ...templateObject,
        ...actualData,
        ...patch
    }
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