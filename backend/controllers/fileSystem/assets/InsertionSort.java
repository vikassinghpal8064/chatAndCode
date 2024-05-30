public class InsertionSort {
    public static void print(int []arr){
        for(int i=0;i<arr.length;i++){
            System.out.print(arr[i]+" ");
        }
    }
    public static void main(String []argv){
        int []arr={2,5,10,-1,6,12,7,40,-10,-20};

        for(int i=1;i<arr.length;i++){
            int temp=arr[i];
            int j=i-1;

            while(j>=0 && arr[j]>temp){
                arr[j+1]=arr[j];
                j--;
            }

            arr[j+1]=temp;
        }
 print(arr);
    }
}
