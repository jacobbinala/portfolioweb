import { Shell } from './components/Shell';
import { BudgetProvider } from './hooks/useBudget';

export default function App() {
  return (
    <BudgetProvider>
      <Shell />
    </BudgetProvider>
  );
}
