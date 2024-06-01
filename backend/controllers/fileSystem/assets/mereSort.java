class mergeSort{
    public static void conquer(int []arr,int s,int mid,int e){
        int m=mid-s+1;
        int n=e-mid;
     int []leftArr= new int[m];
     int []rightArr= new int[n];
     for(int i=0;i<m;i++){
        leftArr[i]=arr[s+i];
     }
     for(int i=0;i<n;i++){
        rightArr[i]=arr[mid+i+1];
     }
     int i=0,j=0,k=s;
     while(i<m && j<n){
        if(leftArr[i]<=rightArr[j]){
            arr[k]=leftArr[i];
            i++;
        }
        else{
            arr[k]=rightArr[j];
            j++;
        }
        k++;
     }

     while(i<m){
        arr[k]=leftArr[i];
        i++;
        k++;
     }
     while(j<n){
        arr[k]=rightArr[j];
        j++;
        k++;
     }
    }
    public static void divide(int []arr,int s,int e){
       if(s<e){
        int mid=s+(e-s)/2;
        divide(arr,s,mid);
        divide(arr,mid+1,e);
        conquer(arr,s,mid,e);
       }
    }

    public static void main(String[] args) {
        int []arr={2,5,10,-1,6,12,7,40,-10,0,11,4};
        divide(arr,0,arr.length-1);

        for(int i=0;i<arr.length;i++){
            System.out.print(arr[i]+" ");
        }
    }
}