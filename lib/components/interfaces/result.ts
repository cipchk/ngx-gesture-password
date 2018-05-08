import { ERR } from './err';

export interface Result {
  err?: ERR;

  result?: string;

  records?: any;
}
