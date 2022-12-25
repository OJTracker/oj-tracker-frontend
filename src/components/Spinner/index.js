import classes from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
}

export default Spinner;