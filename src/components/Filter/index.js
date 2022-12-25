import { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import IconButton from '@mui/material/IconButton';

import classes from "./filter.module.css"

const Filter = () => {

  const [isOpenFilterPage, setIsOpenFilterPage] = useState(true);

  return (
    <>
    <div className={classes.Filters}>
      <p className={classes.filterText}>Filtros Ativos: </p>
      <IconButton className={classes.filterButton} aria-label="filter">
        <TuneIcon />
      </IconButton>
    </div>
      {isOpenFilterPage && 
        <div className={classes.testingFilter}>
        </div>
      }
    </>
  )
}

export default Filter;