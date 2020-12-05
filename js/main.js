window.onload = ()=> {
    let badWords=[];
    let betterWords=new Map();

    function readSingleFile(e) {
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
            let contents = e.target.result;

            new Promise(
                (myResolve)=> {
                    spellCheckAPI(contents, myResolve);
                }
            ).then(
                (value)=> {
                    console.log(value.response.errors);

                    let errArr = value.response.errors;
                    for(const item of errArr){
                        badWords.push(item.bad);
                        betterWords.set(item.bad, item.better);
                        console.log(typeof(item.bad));
                    }

                    console.log(betterWords);
                    document.getElementById('file-content').innerHTML = redContent(contents, badWords);

                    let allSpans = document.querySelectorAll("span");
                    allSpans.forEach(span => {
                        span.addEventListener("mouseover", (e)=> {
                            alert(e.target.textContent);
                            let arr=betterWords.get(e.target.innerHTML);
                            // const UL=document.createElement("ul");
                            // const historyOptions = document.createElement("option");
                            // historyOptions.setAttribute("value", text);
                            // var t = document.createTextNode(text);
                            // historyOptions.appendChild(t);
                            // document.getElementById("selectHistory").appendChild(historyOptions);

                            console.log(arr);

                            e.target.innerHTML="Done";
                        });
                    });
                }
            );
        };

        reader.readAsText(file);
    }

    async function spellCheckAPI(contents, myResolve) {	
        //let endpoint = 'https://api.textgears.com/spelling';
        //let apiKey = '1gVny1rfj02gy7kY';
        let url = "https://api.textgears.com/spelling?key=1gVny1rfj02gy7kY&text=" + contents + "!&language=en-GB";	
        let response = await fetch(url);	
        if(response.ok){
            myResolve(response.json());
        }
    }
    
    function redContent(content, keywords){
        let temp = content;
      
        keywords.forEach(keyword => {
          temp = temp.replace(new RegExp(keyword, 'ig'), wrapKeywordWithHTML(keyword));
        });
      
        return temp;
    }
      
    function wrapKeywordWithHTML(keyword){
        return ` <span style="font-weight: bold; color: red; font-size: 20px">  ${keyword}  </span> `;
    }
    
    document.getElementById('file-input')
        .addEventListener('change', readSingleFile, false);

    
}