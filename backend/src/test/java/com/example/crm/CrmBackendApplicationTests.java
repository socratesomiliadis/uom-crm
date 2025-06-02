package com.example.crm;

import com.example.crm.dto.CompanyDto;
import com.example.crm.service.CompanyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CompanyServiceTest {
    @Autowired
    private CompanyService companyService;

    @Test
    public void testCreateAndRetrieveCompany() {
        CompanyDto dto = new CompanyDto();
        dto.setName("TestCo");
        dto.setIndustry("Tech");
        dto.setCity("San Francisco");
        dto.setCountry("USA");

        CompanyDto saved = companyService.create(dto);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("TestCo");

        CompanyDto fetched = companyService.getById(saved.getId());
        assertThat(fetched.getName()).isEqualTo("TestCo");
        assertThat(fetched.getIndustry()).isEqualTo("Tech");
    }
}
