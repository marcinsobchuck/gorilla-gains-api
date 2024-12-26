import mjml2html from 'mjml';

const getHTMLTemplate = (token: string) =>
  mjml2html(
    `
    <mjml>
  <mj-head>
    <mj-font name="Montserrat" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;400;500;600;700&display=swap" />
  </mj-head>
  <mj-body>
    <mj-section background-color="#121212" full-width="full-width">
      <mj-column>
        <mj-image align="center" width="160px" src="https://drive.usercontent.google.com/download?id=1fjheUD-5Ye4NiM4eT-p5IO_yJPfqPyN7" />
        <mj-divider border-width="1px" border-style="solid" border-color="#FFFFFF40" />
        <mj-spacer height="30px" />
        <mj-button href="http://localhost:5173/entry/forgot-password?token=${token}" border-radius="54px" font-family="Montserrat, Roboto, Arial" font-weight="600" inner-padding="16px 24px" font-size="16px" color="#121212" background-color="#A1D890">
          Reset password
        </mj-button>
        <mj-spacer height="30px" />
        <mj-divider border-width="1px" border-style="solid" border-color="#FFFFFF40" width="100%" />
        <mj-spacer height="16px" />
        <mj-text font-family="Montserrat, Roboto, Arial" color="#FFFFFF" align="center">

          <p>Ignore this e-mail if you didn't request this change.</p>
        </mj-text>
        <mj-spacer height="16px" />
        <mj-social font-size="15px" icon-size="30px" mode="horizontal">
          <mj-social-element name="github" href="https://github.com/marcinsobchuck" />
          <mj-social-element name="linkedin" href="https://www.linkedin.com/in/marcin-sobczak-b66a0a1b5/" />
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `
  );

export const HTMLTemplate = (token: string) => getHTMLTemplate(token).html;
