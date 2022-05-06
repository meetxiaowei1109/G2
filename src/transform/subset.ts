import { TransformComponent as TC } from '../runtime';
import { SubsetTransform } from '../spec';
import { useMemoTransform } from './utils/memo';

function constrain(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export type SubsetOptions = Omit<SubsetTransform, 'type'>;

export const Transform: TC<SubsetOptions> = (options) => {
  return (data) => {
    const { fields = [] } = options;

    let { start = 0, end = data.length } = options;
    start = constrain(start, 0, data.length - 1);
    end = constrain(end, 1, data.length);
    if (start > end) [start, end] = [end, start];

    const pick = (v: any) =>
      fields.reduce((datum, field) => {
        if (field in v) {
          datum[field] = v[field];
        }
        return datum;
      }, {});

    return data.filter((_, i) => i >= start && i < end).map(pick);
  };
};

/**
 * Immutable data sort by specified fields.
 */
export const Subset = useMemoTransform(Transform);

Subset.props = {};