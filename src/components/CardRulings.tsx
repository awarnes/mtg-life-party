import React from 'react';
import Typography from '@material-ui/core/Typography';

import { getURI } from '../data/scryfall';

export default async function CardRulings(props: { rulingsUri: string }) {
  return await getURI(props.rulingsUri).map((ruling: any) => {
    return (
      <div key={ruling.oracle_id}>
        <Typography>Date: {ruling.published_at}</Typography>
        <Typography>Ruling: {ruling.comment}</Typography>
      </div>
    );
  });
}
