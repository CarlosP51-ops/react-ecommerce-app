import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorAPI } from '../../../api/vendor';
import { formatPrice } from '../../../utils/helpers';
import Button from '../../../components/common/UI/Button';
import Input from '../../../components/common/Forms/Input';
import Select from '../../../components/common/Forms/Select';
import Modal from '../../../components/common/UI/Modal';

const PayoutRequest = ({ availableBalance, minimumPayout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('paypal');
  const [accountDetails, setAccountDetails] = useState('');
  const queryClient = useQueryClient();

  const requestMutation = useMutation({
    mutationFn: (data) => vendorAPI.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-payouts']);
      setIsOpen(false);
      setAmount('');
      setAccountDetails('');
      alert('Demande de retrait envoyée avec succès');
    },
  });

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }
    
    if (parsedAmount > availableBalance) {
      alert('Montant supérieur au solde disponible');
      return;
    }
    
    if (parsedAmount < minimumPayout) {
      alert(`Le montant minimum est de ${formatPrice(minimumPayout)}`);
      return;
    }

    requestMutation.mutate({
      amount: parsedAmount,
      method,
      accountDetails: method === 'bank_transfer' ? accountDetails : undefined,
    });
  };

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString());
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        disabled={availableBalance < minimumPayout}
      >
        Demander un retrait
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Demander un retrait"
        size="md"
      >
        <div className="space-y-6">
          {/* Balance Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Solde disponible:</span>
              <span className="font-bold text-gray-900">{formatPrice(availableBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Minimum requis:</span>
              <span className="font-medium text-gray-900">{formatPrice(minimumPayout)}</span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Montant à retirer
              </label>
              <button
                type="button"
                onClick={handleMaxAmount}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Utiliser le maximum
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          {/* Payment Method */}
          <Select
            label="Méthode de paiement"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            options={[
              { value: 'paypal', label: 'PayPal' },
              { value: 'bank_transfer', label: 'Virement bancaire' },
              { value: 'stripe', label: 'Carte (Stripe)' },
            ]}
          />

          {/* Bank Details (if bank transfer) */}
          {method === 'bank_transfer' && (
            <Input
              label="Détails du compte bancaire"
              as="textarea"
              rows={3}
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="IBAN, nom de la banque, nom du titulaire..."
              helperText="Ces informations seront utilisées pour le virement"
            />
          )}

          {/* Processing Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              ⏱️ Les paiements sont traités sous 2-3 jours ouvrables.
              <br />
              💳 Une commission de 2% est appliquée pour les paiements par carte.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={requestMutation.isLoading}
              disabled={!amount || parseFloat(amount) < minimumPayout}
            >
              Confirmer la demande
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PayoutRequest;