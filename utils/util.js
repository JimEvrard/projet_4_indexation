class Util {
     static count_words (arr){
         const arr_sort_of_words = []; 
         const arr_sort_of_counts = []; 
         const arr_final = []; 

         arr.forEach( word => {
             if (!arr_sort_of_words.includes(word)){
                 arr_sort_of_words.push(word)
             }
         });

         for (let i=0; i<arr_sort_of_words.length; i++) {
             arr_sort_of_counts[i] = 0; 
         }
for(let i=0; i<arr_sort_of_words.length; i++) {
    for (let j=0; j<arr.length; j++){
        if (arr[j] === arr_sort_of_words[i]){
            arr_sort_of_counts[i]++; 
        }
    }
}
for(let i=0; i<arr_sort_of_words.length; i++){
arr_final.push({word: arr_sort_of_words[i], count: arr_sort_of_counts[i]});
}

const arr_final_sort = arr_final.sort((a, b) => {
    return b.count - a.count;
})
return arr_final_sort;
     }
    }
     export default Util;


     function getFilesInDirectory() {
        console.log("\nFiles present in directory:");
        let files = fs.readdirSync(__dirname);
        files.forEach(file => {
          console.log(file);
        });}