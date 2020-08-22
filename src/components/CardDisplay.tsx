import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CardRulings from './CardRulings';
import { ICardDisplayProps } from '../lib/mtgLifeInterfaces';

export default function CardDisplay(props: ICardDisplayProps) {
  const { drawerOpen, card } = props;

  return (
    <Card>
      <CardContent></CardContent>
      <CardContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${card.name}-rulings-content`}
            id={`${card.name}-rulings-header`}
          >
            <Typography>Rulings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CardRulings rulingsUri={card.rulingsUri} />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
