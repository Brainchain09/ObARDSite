export function selectFindValue(value, list){
    let index=0
    while (index<list.length){
        if (list[index]['value']==value){
            return list[index]
        }
        index++
    }
    return null
}