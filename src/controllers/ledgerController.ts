import { Request, Response } from 'express';
import { createLedger as createLedgerInDb } from '../model/ledger/createLedger';
import { deleteLedger as deleteLedgerInDb } from '../model/ledger/deleteLedger';
import { fetchOrgLedgers as fetchOrgLedgersFromDb } from '../model/ledger/fetchOrgLedgers';

import { v4 as uuidv4 } from 'uuid';
import { ILedger } from '../model/ledger/ILedger';
import { ILedgerUser } from '../model/ledgerUser/ILedgerUser';
import { createLedgerUser as createLedgerUserInDb } from '../model/ledgerUser/createLedgerUser';

export const createLedger = async (req: Request, res: Response) => {
  const { ledger_name } = req.body;
  const { organizationId: organization_id } = req.params;

  //Add a middleware to this route to ensure only Admin and Managers can access it.

  try {
    //Create Ledger

    const ledgerData: ILedger = {
      name: ledger_name ? ledger_name : null,
      organization_id,
      id: uuidv4()
    };

    const newLedger = await createLedgerInDb(ledgerData);

    //Create Ledger User

    const ledgerUserData: ILedgerUser = {
      user_id: req.user_id,
      ledger_id: newLedger.id,
      organization_id: organization_id,
      id: uuidv4()
    };

    await createLedgerUserInDb(ledgerUserData);

    return res.status(201).json({
      success: true,
      message: 'New ledger created!',
      ledger: newLedger
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const deleteLedger = async (req: Request, res: Response) => {
  const { ledger_id, organizationId: organization_id } = req.params;

  const ledgerData: ILedger = {
    id: ledger_id,
    organization_id
  };

  try {
    const ledger = await deleteLedgerInDb(ledgerData);

    return res.status(201).json({
      success: true,
      message: `Ledger ${ledger.id} deleted!`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const fetchOrgLedgers = async (req: Request, res: Response) => {
  // const { organization_id, organization_user_id } = req.body;

  const { organizationId } = req.params;

  try {
    const ledgers = await fetchOrgLedgersFromDb(organizationId);

    return res.status(201).json({
      success: true,
      message: 'Ledgers fetched!',
      ledgers
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};
