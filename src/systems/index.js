import { mamposteria } from './mamposteria';
import { porticosIntermediosHormigon, porticosEspecialesHormigon } from './porticosHormigon';
import { sistemaDualHormigon } from './sistemaDualHormigon';
import { porticosIntermediosAcero, porticosEspecialesAcero } from './porticosAcero';
import { sistemaDualMetalico } from './sistemaDualMetalico';

export const sistemas = {
  [mamposteria.id]:                    mamposteria,
  [porticosIntermediosHormigon.id]:    porticosIntermediosHormigon,
  [porticosEspecialesHormigon.id]:     porticosEspecialesHormigon,
  [sistemaDualHormigon.id]:            sistemaDualHormigon,
  [porticosIntermediosAcero.id]:       porticosIntermediosAcero,
  [porticosEspecialesAcero.id]:        porticosEspecialesAcero,
  [sistemaDualMetalico.id]:            sistemaDualMetalico,
};