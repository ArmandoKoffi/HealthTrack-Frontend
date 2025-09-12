import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface PasswordCriteria {
  label: string;
  met: boolean;
  required: boolean;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const criteria = useMemo((): PasswordCriteria[] => [
    {
      label: 'Au moins 8 caractères',
      met: password.length >= 8,
      required: true
    },
    {
      label: 'Une minuscule (a-z)',
      met: /[a-z]/.test(password),
      required: true
    },
    {
      label: 'Une majuscule (A-Z)',
      met: /[A-Z]/.test(password),
      required: true
    },
    {
      label: 'Un chiffre (0-9)',
      met: /\d/.test(password),
      required: true
    },
    {
      label: 'Un caractère spécial (!@#$%^&*)',
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      required: false
    }
  ], [password]);

  const requiredCriteria = criteria.filter(c => c.required);
  const metRequiredCriteria = requiredCriteria.filter(c => c.met).length;
  const hasSpecialChar = criteria[4].met;

  const getStrength = () => {
    if (metRequiredCriteria === 4 && hasSpecialChar) {
      return { level: 'strong', label: 'Fort', color: 'success', progress: 100 };
    }
    if (metRequiredCriteria === 4) {
      return { level: 'medium', label: 'Moyen', color: 'warning', progress: 75 };
    }
    if (metRequiredCriteria >= 2) {
      return { level: 'weak', label: 'Faible', color: 'destructive', progress: 40 };
    }
    return { level: 'very-weak', label: 'Très faible', color: 'destructive', progress: 20 };
  };

  const strength = getStrength();
  const isAcceptable = strength.level === 'medium' || strength.level === 'strong';

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Force du mot de passe</span>
          <span className={`font-medium ${
            strength.color === 'success' ? 'text-success' :
            strength.color === 'warning' ? 'text-warning' :
            'text-destructive'
          }`}>
            {strength.label}
          </span>
        </div>
        <Progress 
          value={strength.progress} 
          className={`h-2 ${
            strength.color === 'success' ? '[&>div]:bg-success' :
            strength.color === 'warning' ? '[&>div]:bg-warning' :
            '[&>div]:bg-destructive'
          }`}
        />
      </div>

      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {criterion.met ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={`${
              criterion.met ? 'text-success' : 'text-muted-foreground'
            } ${!criterion.required ? 'italic' : ''}`}>
              {criterion.label} {!criterion.required ? '(optionnel)' : ''}
            </span>
          </div>
        ))}
      </div>

      {!isAcceptable && password.length > 0 && (
        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
          Le mot de passe doit être au moins de force "Moyen" pour être accepté.
        </div>
      )}
    </div>
  );
};