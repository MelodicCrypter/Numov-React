// Just a utility for handling Component errors
const ErrorHandler = (error: Error, componentStack: string) => {
    console.log('From Error Landia: ', Error);
    console.log('From Error Landia: ', componentStack);
};

export default ErrorHandler;
