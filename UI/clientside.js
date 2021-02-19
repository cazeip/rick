class windowManager{
    constructor(){
        this.closeId = undefined;
        this.minimizeId = undefined;
        this.maximizeId = undefined;
    }
    init(){
        console.log("%cHey! You seem to be running this Electron app on a " + (process.platform === "win32" ? "Windows" : "Linux/MacOS") + " PC",'font-size:30px;');
        this.closeId = "closeWindowWin";
        this.minimizeId = "minimizeWindowWin";
        this.maximizeId = "maximizeWindowWin";
        
        document.getElementById(this.closeId).addEventListener('click', this.closeWindow);
        document.getElementById(this.minimizeId).addEventListener('click', this.minimizeWindow);
        document.getElementById(this.maximizeId).addEventListener('click', this.maximizeWindow);
    }
    maximizeWindow(){
        prnt.ipcRenderer.send("maximize");
    }
    minimizeWindow(){
        prnt.ipcRenderer.send("minimize");
    }
    closeWindow(){
        prnt.ipcRenderer.send("close");
    }
}
class buttonInteract{
    constructor(array){
        this.array = array;
    }
    init(){
        this.parseInfo(this.array);
    }
    parseInfo(array){
        for (let i = 0; i < array.length; i++) {
            let element = array[i];
            for (let j = 0; j < element.events.length; j++) {
                const event = element.events[j];
                document.getElementById(element.id).addEventListener(event.name, event.callback);
            }
        }
    }
}
class splashScreen{
    constructor(){
        this.el = document.getElementById("splashscreen");
    }
    close(){
        this.el.style.opacity = "0";
        setTimeout(() => {
            this.el.style.display = "none";
        }, 300);
    }
    open(){
        this.el.style.display = "block";
        setTimeout(() => {
            this.el.style.opacity = "1";
        },10);
        prnt.utils.setTitle("Rick - Welcome!");
    }
}
class runner{
    constructor(){
        
    }
    runRpc(id){
        if(prnt.localStorage.data[id]["app-id"] != ""){
            prnt.ipcRenderer.send('startRpc',prnt.localStorage.data[id]);
        }else{
            alert('There was a problem with your application ID');
        }
    }
}
class utils{
    constructor(){
        window.oncontextmenu = e => {e.preventDefault()}
    }
    setTitle(t){
        document.title = t;
        document.getElementById('topBarTitle').innerText = t;
    }
    createElm(html){
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    }
    getAssets(clientId){
        return fetch(`https://discord.com/api/v8/oauth2/applications/${clientId}/assets`).then(r => r.json());
    }
    formatDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        hour = '' + d.getHours(),
        minutes = '' + d.getMinutes(),
        year = d.getFullYear();
        
        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        if(hour.length < 2 )
        hour = '0' + hour;
        if(minutes.length < 2 )
        minutes = '0' + minutes;
        
        return `${year}-${month}-${day}T${hour}:${minutes}`;
    }
    closePrompt(){
        document.getElementById('promptContent').style.top = "45%"
        document.getElementById('prompt').style.opacity = "0"
        setTimeout(() => {
            document.getElementById('prompt').style.display = "none";
        }, 300);
        document.getElementById('promptInput').value = "";
    }
}
class editor{
    constructor(){
        this.editor = document.getElementById('editor');
        this.editing = -1;
    }
    open(){
        this.editor.style.display = "block";
    }
    newFile(name){
        prnt.mainMenu.close();
        this.open();

        let data = prnt.localStorage.data;
        let doc = {rpc: {}, "rpc-name": name};
        this.editing = data.length;
        prnt.editingFile = doc;
        
        prnt.utils.setTitle(`Rick - Editing "${doc["rpc-name"]}"`);
    }
    openRpc(id){
        prnt.mainMenu.close();
        this.open();
        
        let data = prnt.localStorage.data;
        let doc = data[id];
        this.editing = id;
        prnt.editingFile = doc;
        
        prnt.utils.setTitle(`Rick - Editing "${doc["rpc-name"]}"`);
        
        document.getElementById('appId').value = this.revertCheck(doc["app-id"]);
        document.getElementById('state').value = this.revertCheck(doc.rpc.state);
        document.getElementById('details').value = this.revertCheck(doc.rpc.details);
        document.getElementById('nbPlayers').value = this.revertCheck(doc.rpc.partySize);
        document.getElementById('nbMax').value = this.revertCheck(doc.rpc.partyMax);
        
        if(doc.rpc.startTimestamp === undefined){
            document.getElementById('time').value = prnt.utils.formatDate(doc.rpc.endTimestamp);
        }else if(doc.rpc.endTimestamp === undefined){
            document.getElementById('time').value = prnt.utils.formatDate(doc.rpc.startTimestamp);
        }
    }
    close(){
        this.editor.style.display = "none";
    }
    revertCheck(d){
        return d === undefined ? "" : d;
    }
    check(d){
        return d === "" ? undefined : d;
    }
    checkNumber(d){
        return d === "" ? undefined : parseInt(d);
    }
    setAppId(d){
        prnt.editingFile["app-id"] = this.check(d);
    }
    setState(d){
        prnt.editingFile.rpc.state = this.check(d);
    }
    setDetails(d){
        prnt.editingFile.rpc.details = this.check(d);
    }
    setTime(d){
        let b = new Date(d);
        if(b > (new Date)){
            //after
            prnt.editingFile.rpc.endTimestamp = b.getTime();
            prnt.editingFile.rpc.startTimestamp = undefined;
        }else{
            //before
            prnt.editingFile.rpc.startTimestamp = b.getTime();
            prnt.editingFile.rpc.endTimestamp = undefined;
        }
    }
    setNbPlayers(d){
        prnt.editingFile.rpc.partySize = this.checkNumber(d);
    }
    setNbMax(d){
        prnt.editingFile.rpc.partyMax = this.checkNumber(d);
    }
}
class mainMenu{
    constructor(){
        this.el = document.getElementById('mainMenu');
    }
    open(){
        this.el.style.display = "block";
        this.parseInfo(prnt.localStorage.data);
        setTimeout(() => {
            this.el.style.opacity = "1";
            this.el.style.transform = "scale(1)";
        },10);
        prnt.utils.setTitle("Rick - Main Menu");
    }
    close(){
        this.el.style.opacity = "0";
        this.el.style.transform = "scale(1.2)";
        setTimeout(() => {
            this.el.style.display = "none";
        }, 300);
    }
    parseInfo(d){
        document.getElementsByClassName('mainMenuList')[0].innerHTML = "";
        for (let i = 0; i < d.length; i++) {
            const element = d[i];
            let htmlel = prnt.utils.createElm(`<div class="listItem"><span class="itemName">${d[i]["rpc-name"]}</span></div>`);
            let edit = document.createElement('button');
            edit.innerText = "Edit";
            edit.classList.add('edit');
            edit.addEventListener('click', _ => {prnt.editor.openRpc(i)});
            
            let run = document.createElement('button');
            run.innerText = "Run";
            run.classList.add('run');
            run.addEventListener('click', _ => {prnt.runner.runRpc(i)});
            
            htmlel.appendChild(edit);
            htmlel.appendChild(run);
            
            document.getElementsByClassName('mainMenuList')[0].appendChild(htmlel);
        }
    }
}
class imageModal{
    constructor(){
        this.el = document.getElementById('imageModal');
        this.cnt = document.getElementById('imageModalContent');
        this.imageSelect = document.getElementById('imageSelect');
        this.imageToolTip = document.getElementById('imageTooltip');
        this.editing = -1;
    }
    open(n){
        prnt.utils.getAssets(prnt.editingFile["app-id"]).then(z => {
            if(z.code == undefined){
                if(z.length == 0){
                    alert('this app doesn\'t have any assets');
                }else{
                    this.imageSelect.innerHTML = "";
                    this.imageSelect.appendChild(prnt.utils.createElm(`<option value="undefined">None</option>`))
                    for (let i = 0; i < z.length; i++) {
                        const element = z[i];
                        this.imageSelect.appendChild(prnt.utils.createElm(`<option value="${element.name}">${element.name}</option>`))
                    }
                    this.editing = n;
                    if(this.editing == 1){
                        this.imageToolTip.value = (prnt.editingFile.rpc.smallImageText == undefined) ? "" : prnt.editingFile.rpc.smallImageText;
                        this.imageSelect.value = prnt.editingFile.rpc.smallImageKey;
                    }else if (this.editing == 0){
                        this.imageToolTip.value = (prnt.editingFile.rpc.largeImageText == undefined) ? "" : prnt.editingFile.rpc.largeImageText;
                        this.imageSelect.value = prnt.editingFile.rpc.largeImageKey;
                    }
                    this.el.style.display = "block";
                    setTimeout(() => {
                        this.el.style.opacity = "1"
                        this.cnt.style.top = "50%"
                        this.imageSelect.focus();
                    }, 10);
                }
            }else{
                if(z.code == 50035){
                    alert('The Application ID is Invalid')
                }else if(z.code == 10002){
                    alert('The Application ID is unknown')
                }
            }
        });
        
    }
    close(){
        if(document.getElementById('imageTooltip').value.length === 1){
            alert('Tooltip must be at least 2 characters long.');
        }else{
            this.cnt.style.top = "45%"
            this.el.style.opacity = "0"
            setTimeout(() => {
                this.el.style.display = "none";
            }, 300);
            this.editing = -1;
        }
    }
    setTooltip(e){
        if(this.editing == 1){
            prnt.editingFile.rpc.smallImageText = prnt.editor.check(e);
        }else if(this.editing == 0){
            prnt.editingFile.rpc.largeImageText = prnt.editor.check(e);
        }
    }
    setImageKey(e){
        let j = undefined;
        if(e != "undefined") j = e;
        if(this.editing == 1){
            prnt.editingFile.rpc.smallImageKey = j;
        }else if(this.editing == 0){
            prnt.editingFile.rpc.largeImageKey = j;
        }
    }
}
class lsManager{
    constructor(){
        
    }
    setData(json){
        return localStorage.rpcs = JSON.stringify(json);
    }
    get data(){
        return JSON.parse(localStorage.rpcs);
    }
}
class Bt{
    constructor(){
        this.ipcRenderer = require('electron').ipcRenderer;
        this.localStorage = new lsManager();
        this.splashScreen = new splashScreen;
        this.buttonInteract = new buttonInteract(
            [
                {
                    id: "splashscreenButton",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                prnt.splashScreen.close();
                                localStorage.hasSeenSplashScreen = true;
                                prnt.mainMenu.open();
                            }
                        }
                    ]
                },
                {
                    id: "largeImage",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                prnt.imageModal.open(0);
                            }
                        }
                    ]
                },
                {
                    id: "smallImage",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                prnt.imageModal.open(1);
                            }
                        }
                    ]
                },
                {
                    id: "appId",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.editor.setAppId(document.getElementById('appId').value);
                            }
                        }
                    ]
                },
                {
                    id: "state",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.editor.setState(document.getElementById('state').value);
                            }
                        }
                    ]
                },
                {
                    id: "details",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.editor.setDetails(document.getElementById('details').value);
                            }
                        }
                    ]
                },
                {
                    id: "time",
                    events:[
                        {
                            name: "change",
                            callback: () => {
                                prnt.editor.setTime(document.getElementById('time').value);
                            }
                        }
                    ]
                },
                {
                    id: "nbPlayers",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.editor.setNbPlayers(document.getElementById('nbPlayers').value);
                            }
                        }
                    ]
                },
                {
                    id: "nbMax",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.editor.setNbMax(document.getElementById('nbMax').value);
                            }
                        }
                    ]
                },
                {
                    id: "imageTooltip",
                    events:[
                        {
                            name: "keyup",
                            callback: () => {
                                prnt.imageModal.setTooltip(document.getElementById('imageTooltip').value);
                            }
                        }
                    ]
                },
                {
                    id: "imageSelect",
                    events:[
                        {
                            name: "change",
                            callback: () => {
                                prnt.imageModal.setImageKey(document.getElementById('imageSelect').value);
                            }
                        }
                    ]
                },
                {
                    id: "imageModalClose",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                prnt.imageModal.close();
                            }
                        }
                    ]
                },
                {
                    id: "newRPC",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                document.getElementById('prompt').style.display = "block";
                                setTimeout(() => {
                                    document.getElementById('prompt').style.opacity = "1";
                                    document.getElementById('promptContent').style.top = "50%";
                                    document.getElementById('promptInput').focus();
                                },10);
                            }
                        }
                    ]
                },
                {
                    id: "prompt",
                    events:[
                        {
                            name: "click",
                            callback: (e) => {
                                if(e.target == document.getElementById('prompt')){
                                    prnt.utils.closePrompt();
                                }
                            }
                        }
                    ]
                },
                {
                    id: "closePromptButton",
                    events:[
                        {
                            name: "click",
                            callback: (e) => {
                                prnt.utils.closePrompt();
                            }
                        }
                    ]
                },
                {
                    id: "confirmModalButton",
                    events:[
                        {
                            name: "click",
                            callback: (e) => {
                                if(document.getElementById('promptInput').value != ""){
                                    prnt.editor.newFile(document.getElementById('promptInput').value);
                                    prnt.utils.closePrompt();
                                }else{
                                    alert('Your Rich Presence Name must contain something!')
                                }
                            }
                        }
                    ]
                },
                {
                    id: "backButton",
                    events:[
                        {
                            name: "click",
                            callback: () => {
                                prnt.editor.close();
                                let savedData = prnt.localStorage.data;
                                savedData[prnt.editor.editing] = this.editingFile;
                                prnt.editingFile = {rpc:{}};
                                prnt.editor.editing = -1;
                                prnt.localStorage.setData(savedData);
                                document.getElementById('appId').value = "";
                                document.getElementById('state').value = "";
                                document.getElementById('details').value = "";
                                document.getElementById('nbPlayers').value = "";
                                document.getElementById('nbMax').value = "";
                                document.getElementById('time').value = "";
                                prnt.mainMenu.open();
                            }
                        }
                    ]
                },
            ]
            );
            this.mainMenu = new mainMenu();
            this.utils = new utils();
            this.windowManager = new windowManager();
            this.runner = new runner();
            this.editingFile = {rpc:{}};
            this.editor = new editor();
            this.imageModal = new imageModal();
    }
    init(){
        this.buttonInteract.init();
        this.windowManager.init();
        setTimeout(() => {
            if(localStorage.hasSeenSplashScreen == undefined){
                this.splashScreen.open();
            }else{
                prnt.mainMenu.open();
            }
            if(localStorage.rpcs == undefined) localStorage.rpcs = "[]";
        }, 500);
    }
}
let prnt;
(prnt = new Bt()).init();