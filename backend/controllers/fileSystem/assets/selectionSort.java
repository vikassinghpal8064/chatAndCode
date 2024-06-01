class selectionSort{
public static void print(int []arr){
    for(int i=0;i<arr.length;i++){
        System.out.print(arr[i]+" ");
    }
}
    public static void main(String []argv){
        int []arr={2,5,10,-1,6,12,7,40,-10};

        for(int i=0;i<arr.length-1;i++){
            int minInd=i;
            for(int j=i+1;j<arr.length;j++){
                if(arr[j]<arr[minInd]){
                    minInd=j;
                }
            }
            int temp=arr[i];
            arr[i]=arr[minInd];
            arr[minInd]=temp;
        }
        print(arr);
   
    }
}