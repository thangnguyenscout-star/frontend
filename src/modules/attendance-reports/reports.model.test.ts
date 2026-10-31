import { describe, expect, it } from 'vitest';
import {
  buildReport,
  excelColumn,
  makeRecords,
  monthDays,
  reportEmployees,
  reportTabs,
} from './reports.model';

describe('attendance report prototype data', () => {
  it('uses the selected month and handles leap years', () => {
    expect(monthDays('2024-02')).toHaveLength(29);
    expect(monthDays('2026-02')).toHaveLength(28);
    expect(monthDays('2026-13')).toEqual([]);
    expect(monthDays('')).toEqual([]);
    expect(makeRecords('2026-10')).toHaveLength(reportEmployees.length * 31);
    expect(makeRecords('2026-02').every((r) => r.date.startsWith('2026-02-'))).toBe(true);
  });
  it('provides complete cells and stable unique rows for all five reports', () => {
    for (const tab of reportTabs) {
      const { rows, columns } = buildReport(tab.key, '2026-10');
      expect(rows.length).toBeGreaterThan(0);
      expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
      for (const row of rows) for (const column of columns) expect(row[column.key]).toBeDefined();
    }
  });
  it('reconciles monthly work, leave and OT with the payroll summary', () => {
    const monthly = buildReport('monthly', '2026-10').rows;
    const payroll = buildReport('payroll', '2026-10').rows;
    for (const summary of payroll) {
      const month = monthly.find((r) => r.code === summary.code)!;
      expect(summary.work).toBe(month.work);
      expect(summary.leave).toBe(month.leave);
      expect(summary.ot).toBe(month.ot);
      expect(summary.paid).toBe(Number(summary.work) + Number(summary.leave));
      expect(summary.scheduled).toBe(
        Number(summary.work) +
          Number(summary.leave) +
          Number(summary.unpaid) +
          Number(summary.unverified),
      );
      expect(summary.closingLeave).toBe(
        Number(summary.openingLeave) + Number(summary.accruedLeave) - Number(summary.usedLeave),
      );
    }
  });
  it('counts night OT as a subset and reconciles approved and pending OT', () => {
    for (const row of buildReport('overtime', '2026-10').rows) {
      expect(row.ot).toBe(Number(row.weekdayOt) + Number(row.weekendOt));
      expect(row.ot).toBe(Number(row.approvedOt) + Number(row.pendingOt));
      expect(Number(row.nightOt)).toBeLessThanOrEqual(Number(row.ot));
    }
  });
  it('keeps missing punches out of verified work and violation minutes', () => {
    const monthly = buildReport('monthly', '2026-10').rows;
    const anomalies = buildReport('anomaly', '2026-10').rows;
    expect(monthly.reduce((s, r) => s + Number(r.issues), 0)).toBe(anomalies.length);
    for (const row of anomalies) {
      expect(row.late).toBe(0);
      expect(row.early).toBe(0);
      if (row.anomaly === 'Thiếu giờ vào') expect(row.checkIn).toBe('—');
      if (row.anomaly === 'Thiếu giờ ra') expect(row.checkOut).toBe('—');
    }
    expect(
      buildReport('late', '2026-10').rows.every((r) => Number(r.late) > 0 || Number(r.early) > 0),
    ).toBe(true);
  });
  it('labels spreadsheet columns beyond Z', () => {
    expect([0, 25, 26, 51, 52].map(excelColumn)).toEqual(['A', 'Z', 'AA', 'AZ', 'BA']);
  });
});
