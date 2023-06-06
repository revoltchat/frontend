import {
  BiRegularAtom,
  BiRegularWindowClose,
  BiRegularWindowOpen,
  BiSolidWindowAlt,
} from "solid-icons/bi";

import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  Typography,
} from "@revolt/ui";

/**
 * Desktop Configuration Page
 */
export default function Native() {
  return (
    <Column gap="xl">
      <CategoryButton
        icon={<BiRegularAtom size={24} />}
        description="Version 1.0.0"
      >
        Revolt Desktop
      </CategoryButton>

      <Column>
        <Typography variant="label">App Behaviour</Typography>
        <CategoryButtonGroup>
          <FormGroup>
            <CategoryButton
              action={<Checkbox value onChange={(value) => void value} />}
              onClick={() => void 0}
              icon={<BiRegularWindowOpen size={24} />}
              description="Launch Revolt when you log into your computer."
            >
              Start with Computer
            </CategoryButton>
          </FormGroup>
          <FormGroup>
            <CategoryButton
              action={<Checkbox value onChange={(value) => void value} />}
              onClick={() => void 0}
              icon={<BiRegularWindowClose size={24} />}
              description="Instead of closing, Revolt will hide in your tray."
            >
              Minimise to Tray
            </CategoryButton>
          </FormGroup>
        </CategoryButtonGroup>
      </Column>

      <Column>
        <Typography variant="label">Appearance</Typography>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<BiSolidWindowAlt size={24} />}
            description="Let Revolt use its own custom titlebar."
          >
            Custom window frame
          </CategoryButton>
        </FormGroup>
      </Column>
    </Column>
  );
}
