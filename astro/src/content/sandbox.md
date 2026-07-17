---
title: Reference Popup System Test - Sandbox
description: Test page demonstrating the reference popup functionality with manual markup using data attributes
---

# Reference Popup System Test

This sandbox page demonstrates the reference popup functionality using content from the public health approach section. Hover over or focus on the citations to see reference details in accessible tooltips.

## The Public Health Framework

Evidence-informed violence prevention efforts utilize a public health framework to prevent violence. This approach is grounded in the scientific method and includes four steps <span data-ref="cdc-2024">(Centers for Disease Control and Prevention [CDC], 2024)</span>:

### Define and monitor the problem

Understanding who experiences violence, as well as when and where it occurs, is the first step in preventing violence. Data can help us understand the prevalence of violence, where it occurs, trends in violence rates over time, and who it impacts. In defining violence, it is also critical to find appropriate, validated measurements.

### Identify risk and protective factors

We need to understand what factors protect individuals from experiencing or perpetrating violence, and what factors place individuals at greater risk for victimization or perpetration. These factors can help providers know where to focus violence prevention efforts.

Test: <span data-ref="cdc-2024">(Centers for Disease Control and Prevention [CDC], 2024)</span>.

### Develop and test prevention strategies

Prevention efforts are developed and modified based on community needs, practitioner and organizational expertise and experience, and participant, stakeholder, and collaborator feedback. Once prevention strategies are developed or identified for implementation, strategies should be evaluated to ensure they are effective. Evidence-based practices are vital to ensure programs are doing what they set out to do.

### Assure widespread adoption

Communities are encouraged to implement evidence-based programs. Additionally, they should continually assess if the strategy is a good match for their participants or community area, evaluating any adaptations or changes. The growing evidence-base for violence prevention practices will fuel widespread adoption of evidence-based strategies.

## Social-Ecological Model and Prevention Strategies

Within the public health approach, further guidance is provided to organize strategies for better synergy. This guidance includes utilizing the social-ecological model to examine risk and protective factors, as well as providing organization for prevention strategies based on when and to whom services are targeted. The social-ecological model is a framework for understanding where to target violence prevention efforts, including addressing factors at the individual, relational, community, or society level.

Violence prevention efforts aim to decrease risks (i.e., factors that place individuals at a higher risk for violence victimization or perpetration) and strengthen protection (i.e., factors that protect individuals from experiencing or perpetrating violence). Risk and protective factors exist at various levels of the social-ecological model, including individual, relational, community, and societal factors <span data-ref="centers-2019,wilkins-2014">(CDC, 2019; Wilkins et al., 2014)</span>. Comprehensive efforts that address prevention across multiple levels of the social-ecological model are more sustainable and can have more of a long-term impact. Thus, violence prevention efforts should aim to address factors across the social-ecological model whenever possible.

The Centers for Disease Control and Prevention have urged researchers to consider how multiple forms of violence can share many of the same risk and protective factors <span data-ref="wilkins-2014">(Wilkins et al., 2014)</span>. By considering these shared factors, programs can be expanded or enhanced to prevent multiple forms of violence.

## Primary, Secondary, and Tertiary Prevention

Violence prevention efforts can also be organized by when they take place and who is the focus of prevention efforts <span data-ref="centers-2019">(CDC, 2019)</span>:

## Additional Test References

Here are some additional references to test the popup system (using exact IDs from generated references.json):

- Single reference test: <span data-ref="armstead-2021">(Armstead et al., 2021)</span>
- Book reference test: <span data-ref="bentgoodley-2019">(Bent-Goodley et al., 2019)</span>
- Web reference test: <span data-ref="ginwright-2018">(Ginwright, 2018)</span>
- Journal reference test: <span data-ref="felitti-1998">(Felitti et al., 1998)</span>
- SAMHSA reference test: <span data-ref="substance-2014">(SAMHSA, 2014)</span>
- Multiple references test: <span data-ref="american-2009,samhsa-2017">(APHA, 2009; SAMHSA, 2017)</span>
- Illinois references test: <span data-ref="illinois-2022,illinois-2024">(Illinois Department of Public Health, 2022; Illinois State Police, 2024)</span>
- WHO references test: <span data-ref="world-2002,world-2023">(World Health Organization, 2002; World Health Organization, 2023)</span>
- David-Ferdon reference: <span data-ref="davidferdon-2016">(David-Ferdon et al., 2016)</span>
- National Center reference: <span data-ref="national-2017">(National Center for Injury Prevention and Control, 2017)</span>
- Invalid reference test: <span data-ref="nonexistent-ref">(This should show an error)</span>

## Debug Section - All Available Reference IDs

Test each of these individual reference IDs to verify they work:

- <span data-ref="american-2009">american-2009</span>
- <span data-ref="armstead-2021">armstead-2021</span>
- <span data-ref="bentgoodley-2019">bentgoodley-2019</span>
- <span data-ref="centers-2019">centers-2019</span>
- <span data-ref="cdc-2024">cdc-2024</span>
- <span data-ref="davidferdon-2016">davidferdon-2016</span>
- <span data-ref="felitti-1998">felitti-1998</span>
- <span data-ref="garthe-2021">garthe-2021</span>
- <span data-ref="garthe-2021-1">garthe-2021-1</span>
- <span data-ref="ginwright-2018">ginwright-2018</span>
- <span data-ref="illinois-2022">illinois-2022</span>
- <span data-ref="illinois-2024">illinois-2024</span>
- <span data-ref="national-2017">national-2017</span>
- <span data-ref="office">office</span>
- <span data-ref="substance-2014">substance-2014</span>
- <span data-ref="samhsa-2017">samhsa-2017</span>
- <span data-ref="wilkins-2014">wilkins-2014</span>
- <span data-ref="world-2002">world-2002</span>
- <span data-ref="world-2023">world-2023</span>

## Testing Instructions

1. **Hover Testing**: Move your mouse over any citation to see the reference popup
2. **Keyboard Testing**: Use Tab to navigate to citations, then press Enter or Space to activate
3. **Mobile Testing**: Tap on citations to see popups that auto-dismiss after 4 seconds
4. **Multiple References**: Test citations with comma-separated reference IDs
5. **Error Handling**: Test with invalid reference IDs to see error states
6. **Accessibility**: Use screen readers to verify proper ARIA labeling and announcements

## Expected Behavior

- **Loading State**: Brief "Loading reference..." message while data loads
- **Success State**: Full citation information in tooltip
- **Error State**: Clear error message for missing references
- **Multiple References**: Formatted list of multiple citations
- **Keyboard Navigation**: Full keyboard accessibility with proper focus management
- **Mobile Support**: Touch-friendly activation with auto-dismiss
- **Screen Reader Support**: Proper ARIA labels and announcements

## Technical Details

This test page uses:

- **Data Attributes**: `data-ref="reference-id"` for single references
- **Multiple References**: `data-ref="ref1,ref2,ref3"` for multiple citations
- **Automatic Enhancement**: Client-side plugin automatically finds and enhances elements
- **Vue Components**: ReferenceTooltip component wraps AccessibleTooltip
- **VueUse Integration**: Optimized data loading and caching
- **Error Handling**: Graceful degradation for missing or invalid references
