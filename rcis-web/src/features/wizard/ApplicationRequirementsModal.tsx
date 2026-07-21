import Modal from '@/components/Modal';
import { GENERAL_REQUIREMENTS, SPECIALIST_REQUIREMENTS } from '@/features/wizard/wizard-types';

export default function ApplicationRequirementsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Application Requirements" onClose={onClose}>
      <p>Kindly ensure you have the following attachments before proceeding further.</p>
      <p className="mt-2 font-medium">The attachments includes:</p>
      <ul className="list-disc list-outside pl-5 mt-2 space-y-1">
        {GENERAL_REQUIREMENTS.map((item) => (
          <li key={item.text}>
            {item.text}
            {item.mandatory && <span className="text-red-600">*</span>}
          </li>
        ))}
        <li>
          <span className="text-red-600">Fields Marked In Red are Mandatory</span>
        </li>
      </ul>

      <h3 className="mt-5 font-semibold" style={{ color: 'var(--rcis-primary)' }}>
        Mandatory Requirements For Specialist Contractors
      </h3>
      <p className="mt-2 font-medium">
        Electrical Engineering Services/Mechanical Engineering Services SubClasses:
      </p>
      <ul className="list-disc list-outside pl-5 mt-2 space-y-1">
        {SPECIALIST_REQUIREMENTS.map((item) => (
          <li key={item.text}>
            {item.link ? (
              <a href="#" className="hover:underline" style={{ color: 'var(--rcis-primary)' }}>
                {item.text}
              </a>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
